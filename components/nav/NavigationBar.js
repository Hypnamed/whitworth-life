import Image from "next/image";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { Menu } from "lucide-react";
import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function NavigationBar() {
  return (
    <div>
      {/* Desktop Navigation Bar */}
      <header className="hidden md:flex justify-between my-2 mx-4">
        <div className="flex gap-4">
          <Image
            alt="Whitworth Logo"
            src="/whitworth.png"
            width="32"
            height="32"
          />
          <Link href="/">
            <h1 className="font-normal text-2xl">Whitworth Life</h1>
          </Link>
        </div>
        <div className="flex gap-2">
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
          <Link href="/social">
            <Button className="w-16 h-8" variant="ghost">
              Social
            </Button>
          </Link>
        </div>
        <div className="flex gap-2">
          <SignedOut>
            <SignUpButton>
              <Button disabled>Sign Up</Button>
            </SignUpButton>
            <SignInButton>
              <Button disabled>Login</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>
      {/* Mobile Navigation Bar */}
      <header className="flex md:hidden my-2 justify-between mx-4">
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Menu className="mx-auto mt-2" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-background">
              <DropdownMenuLabel>
                <p className="font-bold">Profile</p>
              </DropdownMenuLabel>
              <DropdownMenuItem>
                <Link href="/login">Login</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/signup">Sign Up</Link>
              </DropdownMenuItem>
              <DropdownMenuLabel>
                <p className="font-bold">Menu</p>
              </DropdownMenuLabel>
              <DropdownMenuItem>
                <Link href="/map">Map</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/events">Events</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/social">Social</Link>
              </DropdownMenuItem>
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
