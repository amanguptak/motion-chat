"use client";

import { useSocket } from "@/context/SocketProvider";
import { useSession } from "next-auth/react"; // Import useSession from next-auth
import { useState, useEffect, useRef } from "react";

interface MessageI {
  email: string;
  message: string;
  timestamp: string;
}

const Message = () => {
  const { sendMessage, messages } = useSocket();
  const { data: session } = useSession(); // Get session data
  const [message, setMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Scroll to the bottom automatically when a new message arrives
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setMessage(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(message);
    setMessage(""); // Clear input after sending
  };

  const isSameSender = (index: number, sortedMessages: MessageI[]) => {
    if (index === 0) return false;
    return sortedMessages[index]?.email === sortedMessages[index - 1]?.email;
  };

  const sortedMessages = messages.slice().sort((a: MessageI, b: MessageI) => {
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}, ${date.toLocaleDateString([], { month: "short", day: "numeric" })}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#6D91EE] to-[#3B4CAB] flex justify-center items-center p-4">
      <div className="flex flex-col w-full max-w-4xl h-[80vh] bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-lg shadow-lg space-y-4 relative">

        {/* Chat window */}
        <div className="flex-grow overflow-y-auto px-4 py-2 space-y-3 scrollbar-custom mb-6"> {/* Increased margin for separation */}
          {sortedMessages?.length ? (
            sortedMessages.map((msg, index) => {
              const isMe = msg.email === session?.user?.email;
              const isSame = isSameSender(index, sortedMessages);

              return (
                <div
                  key={index}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`p-4 rounded-2xl text-white max-w-lg break-words ${
                      isMe
                        ? "bg-blue-500 text-right rounded-br-none"
                        : "bg-gray-700 text-black text-left rounded-bl-none"
                    } ${isSame ? "" : "mt-3"}`} 
                  >
                    {!isSame && (
                      <span className="text-sm text-yellow-400 font-semibold block mb-1">
                        {msg.email}
                      </span>
                    )}
                    <p className="leading-snug">{msg.message}</p>
                    <div className="text-xs text-orange-400 mt-2 text-right">
                      {formatTimestamp(msg.timestamp)}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-300">No messages yet.</div>
          )}
          {/* Dummy div to help with auto-scrolling */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input section with 3D effect */}
        <form onSubmit={handleSubmit} className="flex items-center justify-between space-x-4 py-4 px-6 bg-[#ffedda] rounded-full shadow-2xl transform transition duration-300 ease-in-out hover:shadow-3xl">
          <input
            type="text"
            required
            placeholder="Type your message..."
            className="flex-grow px-6 py-3 rounded-full border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#ffab76] text-white placeholder-white transition-transform transform hover:scale-105"
            name="message"
            value={message}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-full transition-all duration-500 ease-in-out transform hover:scale-110 shadow-xl hover:shadow-3xl"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Message;
