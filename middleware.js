import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Add all Clerk public/auth routes here
const isPublicRoute = createRouteMatcher([
  "/log-in(.*)",
  "/sign-up(.*)",
  "/forgot-password(.*)",
  "/reset-password(.*)",
  "/verify-email(.*)",
  "/",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Exclude Clerk public/auth routes from middleware
    "/((?!_next|sign-in|sign-up|forgot-password|reset-password|verify-email|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
