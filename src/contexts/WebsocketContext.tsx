import { createContext } from 'react';
import { io, Socket } from 'socket.io-client';

export const socket = io("https://apidev.facechain.org",{
  "path":"/facelink/socket/"
});
export const WebsocketContext = createContext<Socket>(socket);
export const WebsocketProvider = WebsocketContext.Provider;
