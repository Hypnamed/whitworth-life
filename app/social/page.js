import Image from "next/image";

export default function SocialPage() {
  return (
    <main>
      <section className="flex flex-col items-center justify-center mt-16 mx-10 gap-4">
        <h1 className="text-3xl font-bold">Social Page</h1>
        <p className="text-center text-lg">
          Sorry, this page is under construction. Check back later!
        </p>
        <Image alt="Social Page" src="/sorrybro.jpg" width="500" height="500" />
      </section>
    </main>
  );
}
