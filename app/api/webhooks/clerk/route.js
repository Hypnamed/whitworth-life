export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { Webhook } from "svix";

const toRole = (val) => {
  if (!val) return "User";
  const s = String(val).toLowerCase();
  if (s === "admin") return "Admin";
  if (s === "faculty") return "Faculty";
  if (s === "moderator" || s === "mod") return "Moderator";
  if (s === "aswu") return "ASWU";
  if (s === "clubleader" || s === "club_leader" || s === "club-leader")
    return "ClubLeader";
  if (s === "user") return "User";
  return "User";
};

export async function OPTIONS() {
  return new Response("ok");
}

export async function POST(req) {
  const h = await headers(); // Fix: await the headers() call
  const svixId = h.get("svix-id");
  const svixTimestamp = h.get("svix-timestamp");
  const svixSignature = h.get("svix-signature");
  const WH_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  console.log("🔥 Webhook received:", {
    svixId,
    svixTimestamp,
    hasSignature: !!svixSignature,
    hasSecret: !!WH_SECRET,
  });

  if (!svixId || !svixTimestamp || !svixSignature || !WH_SECRET) {
    console.error("❌ Missing svix headers/secret");
    return new Response("Missing svix headers/secret", { status: 400 });
  }

  const payload = await req.text();
  let evt;
  try {
    const wh = new Webhook(WH_SECRET);
    evt = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch (error) {
    console.error("❌ Webhook signature verification failed:", error);
    return new Response("Invalid signature", { status: 400 });
  }

  const { type, data } = evt ?? {};
  if (!type || !data) {
    console.error("❌ Bad event structure:", { type, data });
    return new Response("Bad event", { status: 400 });
  }

  console.log(`🚀 Processing webhook event: ${type}`);
  console.log("📋 Event data:", JSON.stringify(data, null, 2));
  console.log(
    "🔍 Public metadata:",
    JSON.stringify(data.public_metadata, null, 2)
  );

  const clerkId = data.id;
  const emails = Array.isArray(data.email_addresses)
    ? data.email_addresses
    : [];
  const primaryEmail =
    emails.find((e) => e.id === data.primary_email_address_id)?.email_address ??
    emails[0]?.email_address ??
    null;
  const name =
    [data.first_name, data.last_name].filter(Boolean).join(" ") || null;

  try {
    if (type === "user.created") {
      const roleInEvent = Object.prototype.hasOwnProperty.call(
        data.public_metadata ?? {},
        "role"
      );
      const role = roleInEvent ? toRole(data.public_metadata.role) : "User";

      console.log(`👤 Creating user ${clerkId} with role: ${role}`);

      // 1) Upsert DB
      const result = await prisma.user.upsert({
        where: { clerkId },
        create: { clerkId, email: primaryEmail, name, role },
        update: { email: primaryEmail, name, role },
      });

      console.log("✅ User created/updated:", result);

      // 2) If role was missing in the event, write it back to Clerk
      if (!roleInEvent) {
        console.log("🔄 Setting default role in Clerk metadata");
        await fetch(`https://api.clerk.com/v1/users/${clerkId}/metadata`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ public_metadata: { role: "User" } }),
        });
      }
    } else if (type === "user.updated") {
      // Always get the role from metadata, defaulting to "User" if not present
      const role = toRole(data.public_metadata?.role);

      console.log(`🔄 Updating user ${clerkId}:`);
      console.log(`   📧 Email: ${primaryEmail}`);
      console.log(`   👤 Name: ${name}`);
      console.log(
        `   🎭 Role from metadata: ${data.public_metadata?.role} -> ${role}`
      );

      // Check if user exists in database first
      const existingUser = await prisma.user.findUnique({
        where: { clerkId },
      });

      console.log(`🔍 Existing user found:`, existingUser ? "YES" : "NO");

      const result = await prisma.user.upsert({
        where: { clerkId },
        create: {
          clerkId,
          email: primaryEmail,
          name,
          role,
        },
        update: {
          email: primaryEmail,
          name,
          role,
        },
      });

      console.log("✅ User updated in database:", result);
      console.log(`🎯 Database role is now: ${result.role}`);
    } else if (type === "user.deleted") {
      console.log(`🗑️ Deleting user ${clerkId}`);
      const result = await prisma.user.deleteMany({ where: { clerkId } });
      console.log("✅ User deleted:", result);
    } else {
      console.log(`ℹ️ Unhandled event type: ${type}`);
    }
  } catch (e) {
    console.error("❌ Webhook DB error:", e);
    return new Response("DB error", { status: 500 });
  }

  console.log(`✅ Successfully processed ${type} event for user ${clerkId}`);
  return new Response("ok", { status: 200 });
}
