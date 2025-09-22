import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function EventCard({
  title,
  description,
  details,
  image,
  location,
  locationId,
  date,
  organizer,
  organizerRole,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <p className="font-bold">{title}</p>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <Link href={`/map?id=${locationId}`}>
            <Button>Show Location</Button>
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        {details ? (
          <p className="text-sm text-muted-foreground whitespace-pre-line mb-2"></p>
        ) : null}
        {image ? (
          <Image
            alt="Event Photo"
            src={image}
            className="self-center"
            width="100"
            height="100"
          />
        ) : null}
        <p>Event will be hosted in {location}</p>
        {organizer && (
          <p className="text-sm text-gray-600 mt-2">
            Posted by {organizer} <Badge>{organizerRole}</Badge>
          </p>
        )}
      </CardContent>
      <CardFooter>
        <p className="font-semibold">{date}</p>
      </CardFooter>
    </Card>
  );
}
