import { io } from "socket.io-client";
import API_BASE_URL from "../config/api";

const socket = io(API_BASE_URL, {
  autoConnect: false,
  transports: ["websocket"],
});

export default socket;
