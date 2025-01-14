import { Server } from "socket.io";
import Redis from "ioredis";
import { produceMessage } from "./kafka";

// const pub = new Redis({
//   host: process.env.REDIS_HOST!,
//   port: parseInt(process.env.REDIS_PORT!, 10),
//   username: process.env.REDIS_USERNAME!,
//   password: process.env.REDIS_PASSWORD!,
// });



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

    sub.subscribe("MESSAGE")
  }

  public initListener() {
    const io = this._io;
    console.log("Initialized Socket listener");
    // io.on("connect", (socket) => {
    //   console.log(`New socket Id connected: ${socket.id}`);

    //   socket.on("event:message", async ({ message }: { message: string }) => {
    //     console.log(`New Message: received: ${message}`);
    //     await pub.publish("MESSAGE", JSON.stringify({message : message}));

    //   });
    // });

    io.on("connect", (socket) => {
      const { email, name } = socket.handshake.query;
      // console.log(`User connected: ${name} (${email})`);
    
      socket.on("event:message", async ({ message, email }) => {
        const timestamp = new Date().toISOString();
        await pub.publish(
          "MESSAGE",
          JSON.stringify({ email, message, timestamp })
        );
      });
    });
    sub.on("message", async(channel,message)=>{
      if(channel==="MESSAGE"){
        io.emit("message",message)
        await produceMessage(message);
        console.log("message produce kafka")
      }
    })
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
