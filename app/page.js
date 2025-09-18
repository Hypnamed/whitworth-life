import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main>
      <section className="flex flex-col items-center justify-center my-20 md:my-40 px-4">
        <h1 className="text-4xl font-bold">Hello, Whitworth!</h1>
        <p className="mt-4 text-lg py-10 max-w-2xl text-center">
          I’ve started building this campus-life app for Whitworth students with
          one main goal: create a digital campus community, a platform where
          students can connect with each other, discover events, and navigate
          Whitworth with ease.
        </p>
        <Link href="/admin">
          <Button>Admin Panel</Button>
        </Link>
      </section>
    </main>
  );
}
