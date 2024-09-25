"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

interface SocketProviderI {
  children?: React.ReactNode;
}

interface MessageI {
  email: string;
  message: string;
  timestamp: string; // Add timestamp property
}

interface SocketContextI {
  sendMessage: (msg: string) => any;
  messages: MessageI[]; // Update the message type to include timestamp
}

const SocketContext = createContext<SocketContextI | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("SocketContext is undefined");
  return context;
};

export const SocketProvider = ({ children }: SocketProviderI) => {
  const { data: session, status } = useSession(); // Get session and authentication status
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<MessageI[]>([]); // State to store messages with timestamp

  // Send a message through the socket
  const sendMessage = useCallback(
    (msg: string) => {
      if (socket && session?.user?.email) {
        const timestamp = new Date().toISOString(); // Generate a timestamp when the message is sent
        socket.emit("event:message", { message: msg, email: session.user.email, timestamp });
        console.log(`Sent message: ${msg}`);
      }
    },
    [socket, session]
  );

  // Handle receiving a message from the socket
  const onMessageReceived = useCallback(
    (msg: string) => {
      const parsedMessage = JSON.parse(msg);
      const { email, message, timestamp } = parsedMessage; // Ensure the message includes email, message, and timestamp

      setMessages((prevMessages) => [
        ...prevMessages,
        { email, message, timestamp },
      ]);
    },
    []
  );

  // Initialize socket connection when the user is authenticated
  useEffect(() => {
    // Ensure session and session.user are defined before proceeding
    if (session?.user?.email && session?.user?.name && status === "authenticated") {
      const socketInstance = io("http://localhost:8000", {
        query: { email: session.user.email, name: session.user.name },
      });
  
      socketInstance.on("message", onMessageReceived);
  
      setSocket(socketInstance);
  
      return () => {
        socketInstance.disconnect();
        socketInstance.off("message", onMessageReceived);
        setSocket(null);
      };
    }
  }, [session, status, onMessageReceived]);
  

  // If the session is loading, show a loading state
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // If the user is not authenticated, show a message
  if (!session) {
    return <div>User is not authenticated</div>;
  }

  return (
    <SocketContext.Provider value={{ sendMessage, messages }}>
      {children}
    </SocketContext.Provider>
  );
};
