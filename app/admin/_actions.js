"use server";

import { checkRole } from "@/utils/roles";
import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

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

export async function setRole(formData) {
  const client = await clerkClient();

  // Ensure only admins can change roles
  if (!(await checkRole("Admin"))) {
    return { message: "Not Authorized" };
  }

  try {
    const userId = formData.get("id");
    const rawRole = formData.get("role");
    const role = toRole(rawRole); // ✅ normalize once and use everywhere

    console.log(`🎭 Setting role for user ${userId} to ${role}`);

    // Update Clerk metadata
    const res = await client.users.updateUserMetadata(userId, {
      publicMetadata: { role }, // ✅ normalized value
    });

    console.log("✅ Clerk metadata updated:", res.publicMetadata);

    // Also update database immediately as backup
    const dbResult = await prisma.user.updateMany({
      where: { clerkId: userId },
      data: { role },
    });

    console.log("✅ Database updated directly:", dbResult);

    // Add a small delay to ensure the database update completes before webhook
    await new Promise((resolve) => setTimeout(resolve, 100));

    return {
      message: `Role set to ${role}. Updated ${dbResult.count} database records.`,
    };
  } catch (err) {
    console.error("❌ Error setting role:", err);
    return { message: String(err) };
  }
}

export async function removeRole(formData) {
  const client = await clerkClient();

  // Guard: only Admins can remove
  if (!(await checkRole("Admin"))) {
    return { message: "Not Authorized" };
  }

  try {
    const userId = formData.get("id");

    console.log(`🗑️ Resetting role for user ${userId} to User`);

    // Update Clerk metadata → always User
    const res = await client.users.updateUserMetadata(userId, {
      publicMetadata: { role: "User" },
    });

    console.log("✅ Clerk metadata updated:", res.publicMetadata);

    // Update DB → always User
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

// New action to manually sync a specific user
export async function syncUserFromClerk(formData) {
  if (!(await checkRole("Admin"))) {
    return { message: "Not Authorized" };
  }

  try {
    const client = await clerkClient();
    const userId = formData.get("id");

    console.log(`🔄 Manually syncing user ${userId} from Clerk`);

    // Get latest user data from Clerk
    const clerkUser = await client.users.getUser(userId);
    const role = toRole(clerkUser.publicMetadata?.role);

    // Update database
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
