import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Add all *public* routes here (no auth required)
const isPublicRoute = createRouteMatcher([
  "/map(.*)",
  "/events(.*)",
  "/log-in(.*)",
  "/sign-up(.*)",
  "/forgot-password(.*)",
  "/reset-password(.*)",
  "/verify-email(.*)",
  "/api/webhooks/clerk", // <-- allow Clerk webhook
  "/api/webhooks/(.*)", // <-- (optional) any other webhooks you add
  "/",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Run middleware for everything except static files and _next
    "/((?!_next|sign-in|sign-up|forgot-password|reset-password|verify-email|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
