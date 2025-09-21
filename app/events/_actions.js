"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { customAlphabet } from "nanoid";

import slugify from "slugify";
const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 8);

export async function upsertEventAction(formData) {
  const user = await currentUser();
  if (!user) throw new Error("Not signed in");
  const userId = user.id;

  const id = formData.get("id");
  const title = String(formData.get("title") || "").trim();
  const description = formData.get("description") || null;
  const detailsJson = formData.get("detailsJson")
    ? JSON.parse(formData.get("detailsJson"))
    : null;
  const imageUrl = formData.get("imageUrl") || null;
  const location = String(formData.get("location") || "").trim();
  const startsAt = new Date(formData.get("startsAt"));
  const endsAt = new Date(formData.get("endsAt"));
  const allDay =
    formData.get("allDay") === "on" || formData.get("allDay") === "true";

  if (!title) throw new Error("Title is required");
  if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
    throw new Error("Invalid dates");
  }
  if (startsAt > endsAt)
    throw new Error("End date can't be earlier than start date");
  if (!location) throw new Error("Location is required");

  const appUser = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!appUser) throw new Error("App user not found");

  if (id) {
    return prisma.event.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        detailsJson,
        imageUrl,
        location,
        startsAt,
        endsAt,
        allDay,
      },
    });
  } else {
    const base = slugify(title, { lower: true, strict: true }) || "event";
    const slug = `${base}-${nanoid()}`;

    return prisma.event.create({
      data: {
        title,
        slug,
        description,
        detailsJson,
        imageUrl,
        location,
        startsAt,
        endsAt,
        allDay,
        organizerId: appUser.id,
        published: true,
      },
    });
  }
}
