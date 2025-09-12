import Image from "next/image";

import { Button } from "@/components/ui/button";
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
  image,
  location,
  locationId,
  date,
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
      </CardContent>
      <CardFooter>
        <p className="font-semibold">{date}</p>
      </CardFooter>
    </Card>
  );
}
