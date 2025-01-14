// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { auth } from "@/auth"; // Your auth function

// // Define which paths should be public
// const publicPaths = ["/login", "/"];

// export async function middleware(request: NextRequest) {
//   const session = await auth(); // Check session or token
//       console.log(session,"in middleware");
// //       if (session) {
  
// //         const username = session?.user?.name;
// //         const email = session?.user?.email;
    
   
// //         try {
// //           const response = await fetch("http://localhost:8000/api/create", {
// //             method: "POST",
// //             headers: {
// //               "Content-Type": "application/json",
// //             },
// //             body: JSON.stringify({ username, email }),
// //           });
// //                 // Log the response for debugging
// //                 const data = await response.json();
// //                 console.log("API response:", data);
          
// //         } catch (error) {
// //           console.error("Failed to store user data:", error);
// //         }
    
// // // Redirects authenticated users to the chat page
// //       }
//   // Get the pathname of the request (e.g., /dashboard, /login)
//   const { pathname } = request.nextUrl;

//   // If the user is not authenticated and is trying to access a protected route, redirect to login
//   if (!session && !publicPaths.includes(pathname)) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   // Allow the request if it's to a public page or the user is authenticated
//   return NextResponse.next();
// }

// // Apply middleware to all routes except public paths
// export const config = {
//   matcher: ["/((?!api|_next|static|favicon.ico).*)"], // Apply to all routes except _next, api, and static files
// };


import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

const publicPaths = ["/login", "/"];

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Read the 'userCreated' cookie from the request
  const userCreatedCookie = request.cookies.get("userCreated");

  if (session && pathname === "/anime-list" && !userCreatedCookie) {
    const username = session?.user?.name;
    const email = session?.user?.email;

    try {
      // Call the create API
      const response = await fetch("http://localhost:8000/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email }),
      });

      const data = await response.json();
      console.log("API response:", data);

      // Create a NextResponse and set the 'userCreated' cookie
      const nextResponse = NextResponse.next();
      nextResponse.cookies.set("userCreated", "true", { maxAge: 60 * 60 * 24 * 30 }); // Expires in 30 days
      return nextResponse;
    } catch (error) {
      console.error("Failed to store user data:", error);
    }
  }

  // Redirect unauthenticated users to login for protected routes
  if (!session && !publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};

