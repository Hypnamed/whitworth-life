require("dotenv/config");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchAllClerkUsers() {
  const base = "https://api.clerk.com/v1/users";
  const headers = { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` };
  const limit = 100;
  let offset = 0;
  let all = [];
  while (true) {
    const res = await fetch(`${base}?limit=${limit}&offset=${offset}`, {
      headers,
    });
    if (!res.ok) throw new Error(`Clerk ${res.status}: ${await res.text()}`);
    const page = await res.json();
    if (!Array.isArray(page)) throw new Error("Unexpected Clerk response");
    all = all.concat(page);
    if (page.length < limit) break;
    offset += limit;
  }
  return all;
}

async function patchClerkRole(userId, role) {
  const res = await fetch(`https://api.clerk.com/v1/users/${userId}/metadata`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ public_metadata: { role } }),
  });
  if (!res.ok)
    throw new Error(`PATCH ${userId} ${res.status}: ${await res.text()}`);
}

(async () => {
  const users = await fetchAllClerkUsers();
  console.log(`Fetched ${users.length} users`);

  for (const u of users) {
    const hasRole =
      u.public_metadata &&
      Object.prototype.hasOwnProperty.call(u.public_metadata, "role");
    const role = hasRole ? String(u.public_metadata.role) : "User";

    await prisma.user.upsert({
      where: { clerkId: u.id },
      create: {
        clerkId: u.id,
        email: u.email_addresses?.[0]?.email_address ?? null,
        name: [u.first_name, u.last_name].filter(Boolean).join(" ") || null,
        role:
          role === "Admin"
            ? "Admin"
            : role === "Faculty"
            ? "Faculty"
            : role === "Moderator"
            ? "Moderator"
            : role === "ASWU"
            ? "ASWU"
            : role === "ClubLeader"
            ? "ClubLeader"
            : "User",
      },
      update: {
        role:
          role === "Admin"
            ? "Admin"
            : role === "Faculty"
            ? "Faculty"
            : role === "Moderator"
            ? "Moderator"
            : role === "ASWU"
            ? "ASWU"
            : role === "ClubLeader"
            ? "ClubLeader"
            : "User",
      },
    });

    if (!hasRole) {
      await patchClerkRole(u.id, "User");
      await sleep(120);
      console.log(`Set Clerk public_metadata.role=User for ${u.id}`);
    }
  }

  console.log("Backfill complete ✅");
})()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
