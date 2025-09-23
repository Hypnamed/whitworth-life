"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export const SearchUsers = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex justify-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const formData = new FormData(form);
          const queryTerm = formData.get("search") || "";
          // Add query to the end of the path while making a search
          router.push(pathname + "?search=" + encodeURIComponent(queryTerm));
        }}
      >
        <Label htmlFor="search" className="font-bold text-2xl justify-center">
          Search for users
        </Label>
        <div className="flex my-4 gap-2">
          <Input id="search" name="search" type="text" className="w-60" />
          <Button type="submit">Search</Button>
        </div>
      </form>
    </div>
  );
};
