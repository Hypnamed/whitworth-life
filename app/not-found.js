import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main>
      <section className="flex flex-col items-center justify-center mt-16 mx-10 gap-4">
        <h2 className="text-2xl font-semibold">This page doesn’t exist 💀</h2>
        <p className="text-center text-lg">
          Oops, you took a wrong turn. This page is totally lost 🚧
        </p>
        <Image alt="404" src="/not-found.jpeg" width="500" height="500" />
        <Link href="/" className="text-blue-500 underline mt-4">
          <Button>Take me home</Button>
        </Link>
      </section>
    </main>
  );
}
