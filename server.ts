import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);
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

    socket.on("proctor:join", (studentData) => {
      socket.join("proctor-room");
      socket.data = { ...studentData, socketId: socket.id };
      io.to("proctor-room").emit("proctor:student-list", Array.from(io.sockets.adapter.rooms.get("proctor-room") || []).map(id => io.sockets.sockets.get(id)?.data).filter(Boolean));
    });

    socket.on("proctor:offer", ({ to, offer }) => {
      io.to(to).emit("proctor:offer", { from: socket.id, offer });
    });

    socket.on("proctor:answer", ({ to, answer }) => {
      io.to(to).emit("proctor:answer", { from: socket.id, answer });
    });

    socket.on("proctor:ice-candidate", ({ to, candidate }) => {
      io.to(to).emit("proctor:ice-candidate", { from: socket.id, candidate });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      activeUsers.delete(socket.id);
      io.emit("active-users", Array.from(activeUsers.values()));
      // Update proctor list on disconnect
      io.to("proctor-room").emit("proctor:student-list", Array.from(io.sockets.adapter.rooms.get("proctor-room") || []).map(id => io.sockets.sockets.get(id)?.data).filter(Boolean));
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
