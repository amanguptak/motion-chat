// import http from "http"
// import SocketService from './services/socket';



// async function init(){
//     const socketService = new SocketService()
//     const httpServer = http.createServer()
//     const PORT = process.env.PORT ? process.env.PORT : 8000;
//     socketService.io.attach(httpServer)
//     httpServer.listen(PORT,()=>{
//         console.log(`HTTP server listening ${PORT}`)
//     })
//     socketService.initListener()
// }

// init()

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import http from "http";
import SocketService from './services/socket'; // Your Socket service
import Routes from "./routes/index"; // Import user routes
import db from './services/prisma'; // Import your Prisma client
import {startMessageConsumer}from "./services/kafka"
dotenv.config();

async function init() {
    startMessageConsumer()
    const app = express();
    const httpServer = http.createServer(app); // Attach Express to the HTTP server
    const socketService = new SocketService();

    const PORT = 8000;

    // Middlewares
    app.use(cookieParser());
    app.use(express.json());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors());

    // Test Prisma connection
    try {
        await db.$connect();
        console.log("Connected to the database successfully");
    } catch (error) {
        console.error("Failed to connect to the database:", error);
    }

    // Routes
    app.use(Routes); // Set up the user routes

    // Attach Socket.io to the HTTP server
    socketService.io.attach(httpServer);

    // Start the server
    httpServer.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });

    // Initialize socket listeners
    socketService.initListener();
}

// Gracefully disconnect from Prisma when the app shuts down
process.on('SIGINT', async () => {
    await db.$disconnect();
    process.exit(0);
});

init();
