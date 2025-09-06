import Image from "next/image";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { FaBars } from "react-icons/fa6";
import Link from "next/link";

export default function NavigationBar() {
  return (
    <div>
      <header className="hidden md:flex justify-between my-2 mx-4">
        <div className="flex gap-4">
          <Link href="/map">
            <Button className="w-16 h-8" variant="ghost">
              Map
            </Button>
          </Link>
          <Link href="/events">
            <Button className="w-16 h-8" variant="ghost">
              Events
            </Button>
          </Link>
          <Link href="/facility">
            <Button className="w-16 h-8" variant="ghost">
              Facility
            </Button>
          </Link>
        </div>
        <div className="flex gap-2">
          <Link href="/">
            <h1 className="font-light text-2xl">Whitworth Life</h1>
          </Link>
          <Image
            alt="Whitworth Logo"
            src="/whitworth.png"
            width="32"
            height="32"
          />
        </div>
      </header>
      <header className="flex md:hidden my-2 justify-between mx-4">
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <FaBars className="mx-auto mt-2" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex gap-2">
          <Link href="/">
            <h1 className="font-light text-2xl">Whitworth Life</h1>
          </Link>
          <Image
            alt="Whitworth Logo"
            src="/whitworth.png"
            width="32"
            height="32"
          />
        </div>
      </header>
    </div>
  );
}
