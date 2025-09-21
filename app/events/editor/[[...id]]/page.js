import EventForm from "@/components/events/EventForm";

import { prisma } from "@/lib/db";

export default async function EventEditorPage({ params }) {
  const id = params?.id?.[0]; // slug or id
  const event = id
    ? await prisma.event.findFirst({
        where: { OR: [{ id: Number(id) || -1 }, { slug: id }] },
      })
    : null;

  return <EventForm initialEvent={event} />;
}
