require("dotenv").config(); // Render uses process.env directly
require("dotenv").config({ path: "../.env" }); // Fallback for local dev if needed
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  allowEIO3: true
});

// Health check endpoint for Render
app.get("/ping", (req, res) => {
  res.status(200).send("Relay Active");
});

app.get("/", (req, res) => {
  res.status(200).send("Relay Node Operational");
});

io.on("connection", (socket) => {
  console.log("Team-linked peer connected:", socket.id);

  
  socket.on("join_team", (teamId) => {
    socket.join(teamId);
    console.log(`Team Sync: Peer ${socket.id} joined Node [${teamId}]`);
    socket.emit("team_synced", { teamId, status: "active" });
  });

  
  socket.on("send_message", async (data) => {
    const { teamId, message, senderId, senderName, targetId } = data;

    try {
      
      const newMessage = await prisma.message.create({
        data: {
          teamId,
          senderId,
          senderName: senderName || "Anonymous Intern",
          content: message,
          targetId: targetId || null,
        },
      });

      
      io.to(teamId).emit("receive_message", { ...newMessage, targetId });
    } catch (error) {
      console.error("Message persistence failure:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Peer disconnected from relay:", socket.id);
  });
});

const PORT = process.env.PORT || 5005;
server.listen(PORT, () => {
  console.log(`Relay Node synchronized on Port ${PORT}`);
});
