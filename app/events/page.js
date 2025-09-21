import EventCard from "@/components/cards/EventCard";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { places } from "@/data/places";

// Helper function to get location name from location ID
function getLocationName(locationId) {
  const place = places.find((p) => p.id === locationId);
  return place ? place.name : locationId;
}

// Helper function to format date for display
function formatEventDate(startsAt, endsAt, allDay) {
  const startDate = new Date(startsAt);
  const endDate = new Date(endsAt);

  const options = {
    month: "long",
    day: "numeric",
    hour: allDay ? undefined : "numeric",
    minute: allDay ? undefined : "2-digit",
    hour12: true,
  };

  if (allDay) {
    return startDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  }

  const startTime = startDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // If same day, show start time only
  if (startDate.toDateString() === endDate.toDateString()) {
    return `${startDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    })} ${startTime}`;
  }

  // If different days, show both dates
  const endTime = endDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${startDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  })} ${startTime} - ${endDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  })} ${endTime}`;
}

export default async function EventsPage() {
  // Fetch events from database
  const events = await prisma.event.findMany({
    where: {
      published: true,
    },
    include: {
      organizer: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      startsAt: "asc",
    },
  });

  // Transform events to match EventCard props
  const transformedEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    description: event.description || "",
    image: event.imageUrl || "/whitworth.png", // Default image
    location: getLocationName(event.location),
    locationId: event.location,
    date: formatEventDate(event.startsAt, event.endsAt, event.allDay),
    organizer: event.organizer?.name || "Unknown",
  }));

  return (
    <main>
      <div className="flex justify-end my-4 mx-4">
        <Link href="/events/editor">
          <Button>
            <CalendarPlus />
            Create New Event
          </Button>
        </Link>
      </div>
      <section className="hidden md:grid justify-center mt-16 mx-10 grid-cols-4 gap-4">
        {transformedEvents.length === 0 ? (
          <p className="col-span-4 text-center text-lg">
            No events scheduled. Create the first event!
          </p>
        ) : (
          transformedEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))
        )}
      </section>
      <section className="grid md:hidden justify-center mt-16 mx-10 grid-cols-1 gap-4">
        {transformedEvents.length === 0 ? (
          <p className="col-span-1 text-center text-lg">
            No events scheduled. Create the first event!
          </p>
        ) : (
          transformedEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))
        )}
      </section>
    </main>
  );
}
