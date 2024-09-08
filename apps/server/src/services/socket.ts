import { Server } from "socket.io";

class SocketService {
  private _io: Server;

  constructor() {
    console.log("SocketService started");
    this._io = new Server({
      cors: {
        origin: "*", // Allow all origins
        methods: ["GET", "POST"], // Allow specific methods
        allowedHeaders: ["*"], // Allow any headers
        credentials: false, // Disable credentials for open access
      },
    });
  }

  public initListener() {
    const io = this._io;
    console.log("Initialized Socket listener");
    io.on("connect", (socket) => {
      console.log(`New socket Id connected: ${socket.id}`);

      socket.on("event message", async ({ message }: { message: string }) => {
        console.log(`New Message: received: ${message}`);
      });
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
