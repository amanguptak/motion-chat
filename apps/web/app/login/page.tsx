import { auth, signIn } from "@/auth";
import Image from "next/image";
import { redirect } from 'next/navigation';

export default async function SignIn() {
  const session = await auth();

  // Server-side redirect if the user is authenticated
  if (session) {
    redirect('/'); // Redirects authenticated users to the chat page
  }

  return (
    <div className="flex items-center justify-center h-screen ">
      <div className="bg-white shadow-lg rounded-lg max-w-sm w-full p-6 space-y-4">
        {/* Image for chat context */}
        <div className="w-full">
          <Image
            src="https://herobot.app/wp-content/uploads/2022/11/11-Reasons-Why-A-Chat-Application-Is-Great-For-Business_1.jpg"
            alt="Chat App"
            width={400}
            height={200}
            className="w-full rounded-t-lg object-cover"
          />
        </div>

        {/* Message */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome to Motion Otaku Chat!
          </h2>
          <p className="text-gray-600">
            Connect with your friends and colleagues instantly. Sign in to get started!
          </p>
        </div>

        {/* Sign-in Button */}
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/" });
          }}
          className="w-full"
        >
          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-3 bg-yellow-400 text-white font-semibold text-lg p-4 rounded-lg shadow-md hover:bg-yellow-500 hover:shadow-lg transform transition-all duration-300 ease-in-out hover:translate-y-[-3px] focus:outline-none focus:ring-4 focus:ring-yellow-300"
          >
            <Image
              src="https://cdn-icons-png.flaticon.com/512/2702/2702602.png"
              alt="Google icon"
              width={28}
              height={28}
            />
            <span>Sign in with Google</span>
          </button>
        </form>
      </div>
    </div>
  );
}
