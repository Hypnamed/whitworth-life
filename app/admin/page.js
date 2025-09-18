import { redirect } from "next/navigation";
import { checkRole } from "@/utils/roles";
import { SearchUsers } from "@/components/admin/SearchUsers";
import { clerkClient } from "@clerk/nextjs/server";
import { removeRole, setRole } from "./_actions";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default async function AdminDashboard({ searchParams }) {
  // Guard: only admins
  if (!(await checkRole("Admin"))) {
    redirect("/");
  }

  // Next.js 15: searchParams is a Promise
  const params = (await searchParams) || {};
  const query = params.search || "";

  const client = await clerkClient();
  const users = query ? (await client.users.getUserList({ query })).data : [];

  return (
    <main>
      <SearchUsers />

      {users.map((user) => {
        const primaryEmail =
          user.emailAddresses.find(
            (email) => email.id === user.primaryEmailAddressId
          )?.emailAddress || "";

        return (
          <div key={user.id}>
            {/* Desktop */}
            <div className="hidden md:flex items-start justify-between border-b py-4 gap-6">
              {/* LEFT: avatar + details */}
              <div className="flex my-4 mx-4 gap-4 min-w-0">
                <Image
                  src={user.imageUrl}
                  alt="Profile Picture"
                  width={75}
                  height={75}
                  className="rounded-md object-cover"
                />
                <div className="min-w-0 align-center">
                  <h1>
                    <span className="font-medium truncate">Name: </span>
                    {user.firstName} {user.lastName}
                  </h1>
                  <div>
                    <span className="font-medium truncate">Email: </span>
                    {primaryEmail}
                  </div>
                  <div>
                    <span className="font-medium truncate">Role: </span>
                    {user.publicMetadata?.role ?? "User"}
                  </div>
                </div>
              </div>

              {/* RIGHT: actions (fixed, no shrink) */}
              <div className="flex flex-col gap-2 shrink-0">
                <form action={setRole}>
                  <input type="hidden" value={user.id} name="id" />
                  <input type="hidden" value="Admin" name="role" />
                  <Button type="submit" className="w-40 h-8">
                    Make Admin
                  </Button>
                </form>
                <form action={setRole}>
                  <input type="hidden" value={user.id} name="id" />
                  <input type="hidden" value="Moderator" name="role" />
                  <Button type="submit" className="w-40 h-8">
                    Make Moderator
                  </Button>
                </form>
                <form action={removeRole}>
                  <input type="hidden" value={user.id} name="id" />
                  <Button
                    variant="destructive"
                    type="submit"
                    className="w-40 h-8"
                  >
                    Remove Role
                  </Button>
                </form>
              </div>
            </div>
            {/* Mobile*/}
            <div className="md:hidden">
              <div className="flex my-4 mx-4 gap-4 min-w-0">
                <Image
                  src={user.imageUrl}
                  alt="Profile Picture"
                  width={75}
                  height={75}
                  className="rounded-md object-cover"
                />
                <div className="min-w-0 align-center">
                  <h1>
                    <span className="font-medium truncate">Name: </span>
                    {user.firstName} {user.lastName}
                  </h1>
                  <div>
                    <span className="font-medium truncate">Email: </span>
                    {primaryEmail}
                  </div>
                  <div>
                    <span className="font-medium truncate">Role: </span>
                    {user.publicMetadata?.role ?? "User"}
                  </div>
                </div>
              </div>

              {/* RIGHT: actions (fixed, no shrink) */}
              <div className="flex flex-col items-center gap-2 shrink-0">
                <form action={setRole}>
                  <input type="hidden" value={user.id} name="id" />
                  <input type="hidden" value="Admin" name="role" />
                  <Button type="submit" className="w-88 h-8">
                    Make Admin
                  </Button>
                </form>
                <form action={setRole}>
                  <input type="hidden" value={user.id} name="id" />
                  <input type="hidden" value="Moderator" name="role" />
                  <Button type="submit" className="w-88 h-8">
                    Make Moderator
                  </Button>
                </form>
                <form action={removeRole}>
                  <input type="hidden" value={user.id} name="id" />
                  <Button
                    variant="destructive"
                    type="submit"
                    className="w-88 h-8"
                  >
                    Remove Role
                  </Button>
                </form>
              </div>
            </div>
          </div>
        );
      })}
    </main>
  );
}
