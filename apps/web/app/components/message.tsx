"use client";

import { useSocket } from "@/context/SocketProvider";
import { useEffect, useState } from "react";

const Message = () => {
  const { sendMessage } = useSocket();
  const [message, setMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setMessage(value);
  };

  useEffect(() => {
    console.log(message, "Message");
  }, [message]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(message);
    setMessage(""); // Clear input after sending
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#6D91EE] to-[#3B4CAB] flex justify-center items-center">
      <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md space-y-4 bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-lg shadow-lg">
        <input
          type="text"
          required
          placeholder="Type your message..."
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          name="message"
          value={message}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-md transition duration-300 ease-in-out"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Message;
