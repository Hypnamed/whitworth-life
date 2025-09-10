import EventCard from "@/components/event/EventCard";
import events from "@/data/events";

export default function EventsPage() {
  return (
    <main>
      <section className="hidden md:grid justify-center mt-16 mx-10 grid-cols-4 gap-4">
        <p className="col-span-4 text-center text-lg">
          Current events are template, data is not live yet.
        </p>
        {events.map((event, i) => (
          <EventCard key={i} {...event} />
        ))}
      </section>
      <section className="grid md:hidden justify-center mt-16 mx-10 grid-cols-1 gap-4">
        <p className="col-span-1 text-center text-lg">
          Current events are template, data is not live yet.
        </p>
        {events.map((event, i) => (
          <EventCard key={i} {...event} />
        ))}
      </section>
    </main>
  );
}
