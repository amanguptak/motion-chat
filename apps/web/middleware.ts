import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth"; // Your auth function

// Define which paths should be public
const publicPaths = ["/login", "/"];

export async function middleware(request: NextRequest) {
  const session = await auth(); // Check session or token
    // console.log(session,"in middleware");
  // Get the pathname of the request (e.g., /dashboard, /login)
  const { pathname } = request.nextUrl;

  // If the user is not authenticated and is trying to access a protected route, redirect to login
  if (!session && !publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow the request if it's to a public page or the user is authenticated
  return NextResponse.next();
}

// Apply middleware to all routes except public paths
export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"], // Apply to all routes except _next, api, and static files
};
