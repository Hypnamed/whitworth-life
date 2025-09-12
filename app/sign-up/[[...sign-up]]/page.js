import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex flex-col items-center justify-center my-20 md:my-40">
      <SignUp />
    </main>
  );
}
