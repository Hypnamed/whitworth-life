"use server";

import { checkRole } from "@/utils/roles";
import { clerkClient } from "@clerk/nextjs/server";

export async function setRole(formData) {
  const client = await clerkClient();

  // Ensure only admins can change roles
  if (!(await checkRole("Admin"))) {
    return { message: "Not Authorized" };
  }

  try {
    const res = await client.users.updateUserMetadata(formData.get("id"), {
      publicMetadata: { role: formData.get("role") },
    });
    return { message: res.publicMetadata };
  } catch (err) {
    return { message: String(err) };
  }
}

export async function removeRole(formData) {
  const client = await clerkClient();

  // Optional but wise: guard this too
  if (!(await checkRole("Admin"))) {
    return { message: "Not Authorized" };
  }

  try {
    const res = await client.users.updateUserMetadata(formData.get("id"), {
      publicMetadata: { role: null },
    });
    return { message: res.publicMetadata };
  } catch (err) {
    return { message: String(err) };
  }
}
