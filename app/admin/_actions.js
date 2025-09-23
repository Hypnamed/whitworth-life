"use server";

// Server actions for Admin user-role management
// Integrations: Clerk (auth) + Prisma (DB)

import { checkRole } from "@/utils/roles";
import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

// Normalize an arbitrary role value into a known enum used across app/DB/Clerk
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

// Action: set a user's role (Admin-only). Updates Clerk metadata and DB.
export async function setRole(formData) {
  const client = await clerkClient(); // Clerk server SDK

  // Authorization guard: only Admins can change roles
  if (!(await checkRole("Admin"))) {
    return { message: "Not Authorized" };
  }

  try {
    // Inputs from form submission
    const userId = formData.get("id");
    const rawRole = formData.get("role");
    const role = toRole(rawRole); // Normalize once and reuse

    console.log(`🎭 Setting role for user ${userId} to ${role}`);

    // 1) Update Clerk public metadata (source of truth for auth layer)
    const res = await client.users.updateUserMetadata(userId, {
      publicMetadata: { role },
    });

    console.log("✅ Clerk metadata updated:", res.publicMetadata);

    // 2) Update database immediately (local cache / backup)
    const dbResult = await prisma.user.updateMany({
      where: { clerkId: userId },
      data: { role },
    });

    console.log("✅ Database updated directly:", dbResult);

    // Tiny delay to help ensure DB write commits before any async listeners/webhooks
    await new Promise((resolve) => setTimeout(resolve, 100));

    return {
      message: `Role set to ${role}. Updated ${dbResult.count} database records.`,
    };
  } catch (err) {
    console.error("❌ Error setting role:", err);
    return { message: String(err) };
  }
}

// Action: reset a user's role back to "User" (Admin-only)
export async function removeRole(formData) {
  const client = await clerkClient(); // Clerk server SDK

  // Authorization guard
  if (!(await checkRole("Admin"))) {
    return { message: "Not Authorized" };
  }

  try {
    const userId = formData.get("id");

    console.log(`🗑️ Resetting role for user ${userId} to User`);

    // Reset in Clerk metadata
    const res = await client.users.updateUserMetadata(userId, {
      publicMetadata: { role: "User" },
    });

    console.log("✅ Clerk metadata updated:", res.publicMetadata);

    // Reset in DB
    const dbResult = await prisma.user.updateMany({
      where: { clerkId: userId },
      data: { role: "User" },
    });

    console.log("✅ Database updated directly:", dbResult);

    return {
      message: `Role reset to User. Updated ${dbResult.count} database records.`,
    };
  } catch (err) {
    console.error("❌ Error resetting role:", err);
    return { message: String(err) };
  }
}

// Action: manually sync a single user's data from Clerk -> DB
export async function syncUserFromClerk(formData) {
  // Only Admin can manually sync
  if (!(await checkRole("Admin"))) {
    return { message: "Not Authorized" };
  }

  try {
    const client = await clerkClient();
    const userId = formData.get("id");

    console.log(`🔄 Manually syncing user ${userId} from Clerk`);

    // Fetch latest user from Clerk
    const clerkUser = await client.users.getUser(userId);
    const role = toRole(clerkUser.publicMetadata?.role);

    // Upsert: create if not found, otherwise update existing record
    const result = await prisma.user.upsert({
      where: { clerkId: userId },
      create: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
        role,
      },
      update: {
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
        role,
      },
    });

    console.log("✅ User synced:", result);
    return {
      message: `User synced successfully. Database role: ${result.role}`,
    };
  } catch (err) {
    console.error("❌ Error syncing user:", err);
    return { message: String(err) };
  }
}
