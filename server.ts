import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();


const activeUsers = new Map<string, any>();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join-community", (userData) => {
      
      activeUsers.set(socket.id, {
        ...userData,
        socketId: socket.id,
        connectedAt: new Date().toISOString()
      });
      
      
      io.emit("active-users", Array.from(activeUsers.values()));
    });

    socket.on("send-message", (message) => {
      
      if (message.targetSocketId) {
        io.to(message.targetSocketId).emit("receive-message", { ...message, isPrivate: true });
        
        socket.emit("receive-message", { ...message, isPrivate: true });
      } else {
        io.emit("receive-message", message);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      activeUsers.delete(socket.id);
      io.emit("active-users", Array.from(activeUsers.values()));
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
