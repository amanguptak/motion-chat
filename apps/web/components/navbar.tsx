"use client";

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react'; // Adjust for Auth.js

const Navbar = () => {
  const { status } = useSession(); // Only using status for conditional rendering
    console.log(status,"status is")
  // Sign-out handler with console log and alert
  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/login" }); // Redirect to login after sign out
      console.log("User has signed out.");
      alert("You have successfully signed out.");
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Error signing out. Please try again.");
    }
  };

  return (
    <nav className="bg-gradient-to-r from-[#6D91EE] to-[#3B4CAB] p-4 shadow-md w-full">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white font-bold text-2xl">Motion Otaku Chat</div>

        {/* Links */}
        <div className="space-x-8 hidden md:flex">
          <Link href="/anime-list" className="text-white hover:text-yellow-400 font-semibold">
          Anime 💕
          </Link>
          <Link href="/" className="text-white hover:text-yellow-400 font-semibold">
            Home
          </Link>

          {status === "authenticated" ? (
            <>
              {/* Show Sign Out when user is authenticated */}
              <button
                onClick={handleSignOut}
                className="text-white hover:text-yellow-400 font-semibold"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              {/* Show Login and Register when user is NOT authenticated */}
              <Link href="/login" className="text-white hover:text-yellow-400 font-semibold">
                Login
              </Link>
            
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <button className="text-white">Menu</button>
          {/* Implement mobile dropdown or drawer menu */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
