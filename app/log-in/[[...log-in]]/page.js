import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex flex-col items-center justify-center my-20 md:my-40">
      <SignIn />
    </main>
  );
}
