import { io, Socket } from "socket.io-client";

let socketInstance: Socket | null = null;

export const initializeSocket = (projectId: string) => {
  socketInstance = io("http://localhost:4000", {
    withCredentials: true,
    query: { projectId },
  });

  return socketInstance;
};

type message = {
  sender?: string;
  message: string;
};

export const receiveMessage = (
  eventName: string,
  callback: (args_0: message) => void
) => {
  socketInstance?.on(eventName, callback);
};

export const sendMessage = (eventName: string, message: string) => {
  socketInstance?.emit(eventName, message);
};
