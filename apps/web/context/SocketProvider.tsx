"use client";

import React, { createContext, useCallback, useContext, useEffect } from "react";
import { io } from "socket.io-client";
interface SocketProviderI {
  children?: React.ReactNode;
}

interface SocketContextI {
  sendMessage: (msg: string) => any;
}

const SocketContext = createContext<SocketContextI | null>(null);

export const useSocket = ()=>{
  const state = useContext(SocketContext);
  if(!state) throw new Error("State is undefined")
  return state
}

export const SocketProvider = ({ children }: SocketProviderI) => {


  // Using SocketContextI["sendMessage"] instead of explicitly writing the function type (msg: string) => any
  const sendMessage: SocketContextI["sendMessage"] = useCallback((msg) => {
    console.log(msg);
  }, []);



  useEffect(() => {
    const socket = io("http://localhost:8000");

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={null}>{children}</SocketContext.Provider>
  );
};
