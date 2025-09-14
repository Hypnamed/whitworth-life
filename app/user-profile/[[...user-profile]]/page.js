import { UserProfile } from "@clerk/nextjs";

export default function userProfile() {
  return (
    <main>
      <section className="flex justify-center my-8">
        <UserProfile />
      </section>
    </main>
  );
}
