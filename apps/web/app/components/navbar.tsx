import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-[#6D91EE] to-[#3B4CAB] p-4 shadow-md w-full">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white font-bold text-2xl">
          Motion Chat
        </div>

        {/* Links */}
        <div className="space-x-8 hidden md:flex">
          <Link href="/chat" className="text-white hover:text-yellow-400 font-semibold">
            Start Chat
          </Link>
          <Link href="/" className="text-white hover:text-yellow-400 font-semibold">
            About
          </Link>
          <Link href="/login" className="text-white hover:text-yellow-400 font-semibold">
            Login
          </Link>
          <Link href="/register" className="text-white hover:text-yellow-400 font-semibold">
            Register
          </Link>
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
