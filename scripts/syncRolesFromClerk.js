require("dotenv/config");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const toRole = (val) => {
  if (!val) return "User";
  const s = String(val).toLowerCase();
  if (s === "admin") return "Admin";
  if (s === "moderator" || s === "mod") return "Moderator";
  if (s === "aswu") return "ASWU";
  if (s === "clubleader" || s === "club_leader" || s === "club-leader")
    return "ClubLeader";
  return "User";
};

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
    if (!res.ok)
      throw new Error(`Clerk API ${res.status} – ${await res.text()}`);
    const page = await res.json();
    if (!Array.isArray(page)) throw new Error("Unexpected Clerk response");
    all = all.concat(page);
    if (page.length < limit) break;
    offset += limit;
  }
  return all;
}

(async () => {
  const users = await fetchAllClerkUsers();
  console.log(`Fetched ${users.length} users from Clerk`);
  for (const u of users) {
    const role = toRole(u.public_metadata?.role);
    await prisma.user.updateMany({
      where: { clerkId: u.id },
      data: { role },
    });
  }
  console.log("Role sync complete ✅");
})()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
