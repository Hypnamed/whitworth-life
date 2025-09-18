require("dotenv/config");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function fetchAllClerkUsers() {
  const base = "https://api.clerk.com/v1/users";
  const headers = { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` };

  const limit = 100;
  let offset = 0;
  let all = [];

  while (true) {
    const url = `${base}?limit=${limit}&offset=${offset}`;
    const res = await fetch(url, { headers });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Clerk API ${res.status} – ${text}`);
    }

    const page = await res.json();
    if (!Array.isArray(page)) {
      throw new Error("Unexpected Clerk response shape (expected array)");
    }

    all = all.concat(page);
    if (page.length < limit) break;
    offset += limit;
  }

  return all;
}

function toDbFields(u) {
  if (!u) return null;
  const primaryEmailObj = (u.email_addresses || []).find(
    (e) => e.id === u.primary_email_address_id
  );
  const email =
    (primaryEmailObj && primaryEmailObj.email_address) ||
    (u.email_addresses && u.email_addresses[0]?.email_address) ||
    null;

  const name = [u.first_name, u.last_name].filter(Boolean).join(" ") || null;

  return {
    clerkId: u.id,
    email,
    name,
  };
}

async function main() {
  const users = await fetchAllClerkUsers();
  console.log(`Fetched ${users.length} Clerk users...`);

  for (const u of users) {
    const rec = toDbFields(u);
    if (!rec || !rec.clerkId) continue;

    await prisma.user.upsert({
      where: { clerkId: rec.clerkId },
      create: rec,
      update: { email: rec.email, name: rec.name },
    });
  }

  console.log("Backfill complete ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
