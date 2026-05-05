require("dotenv").config();
require("dotenv").config({ path: "../.env" });
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
    methods: ["GET", "POST"]
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  allowEIO3: true
});

app.get("/ping", (req, res) => {
  res.status(200).send("Relay Active");
});

app.get("/", (req, res) => {
  res.status(200).send("Relay Node Operational");
});

const activeUsers = new Map();

io.on("connection", (socket) => {
  console.log("Peer connected:", socket.id);

  socket.on("join_team", async ({ teamId, userId }) => {
    socket.join(teamId);
    activeUsers.set(userId, { socketId: socket.id, teamId });
    
    console.log(`Presence: User ${userId} active in Team ${teamId}`);
    
    io.to(teamId).emit("user_status_change", { userId, status: "online" });
    
    socket.emit("team_synced", { teamId, status: "active" });

    const onlineInTeam = [];
    activeUsers.forEach((data, id) => {
      if (data.teamId === teamId) onlineInTeam.push(id);
    });
    socket.emit("online_users", onlineInTeam);
  });

  socket.on("get_history", async (teamId) => {
    try {
      const history = await prisma.message.findMany({
        where: { teamId },
        orderBy: { createdAt: "asc" },
        take: 50,
      });
      socket.emit("chat_history", history);
    } catch (err) {
      console.error("History fetch error:", err);
    }
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

      io.to(teamId).emit("receive_message", newMessage);
    } catch (error) {
      console.error("Persistence error:", error);
    }
  });

  socket.on("disconnect", () => {
    let disconnectedUserId = null;
    activeUsers.forEach((data, id) => {
      if (data.socketId === socket.id) {
        disconnectedUserId = id;
        const teamId = data.teamId;
        activeUsers.delete(id);
        if (disconnectedUserId) {
          io.to(teamId).emit("user_status_change", { userId: disconnectedUserId, status: "offline" });
        }
      }
    });
    console.log("Peer disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5005;

// Verify Database Connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('CRITICAL: Database connection failed:', err);
  } else {
    console.log('DATABASE: Connected successfully at', res.rows[0].now);
  }
});

server.listen(PORT, () => {
  console.log(`Relay Node synchronized on Port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS Origin: *`);
});
