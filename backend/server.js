require("dotenv").config();

const http = require("http");
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const db = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const chatRoutes = require("./routes/chatRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", paymentRoutes);
app.use("/api", chatRoutes);
app.use("/api", adminRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join-room", ({ roomId }) => {
    if (!roomId) return;
    const room = String(roomId);
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  socket.on("leave-room", ({ roomId }) => {
    if (!roomId) return;
    const room = String(roomId);
    socket.leave(room);
    console.log(`Socket ${socket.id} left room ${room}`);
  });

  socket.on("send-message", (payload) => {
    const { roomId, ...data } = payload || {};
    if (!roomId) return;
    const room = String(roomId);
    socket.to(room).emit("receive-message", data);
    socket.emit("message-delivered", { messageId: data.id, sender: data.sender });
  });

  socket.on("typing", ({ roomId, sender, userId }) => {
    if (!roomId) return;
    const room = String(roomId);
    socket.to(room).emit("typing", { sender, userId });
  });

  socket.on("stop-typing", ({ roomId, sender, userId }) => {
    if (!roomId) return;
    const room = String(roomId);
    socket.to(room).emit("stop-typing", { sender, userId });
  });

  socket.on("message-seen", ({ roomId, messageId, sender, userId }) => {
    if (!roomId) return;
    const room = String(roomId);
    socket.to(room).emit("message-seen", { messageId, sender, userId });
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

function initializeDatabase() {
  const createAdminTable = `
    CREATE TABLE IF NOT EXISTS admin (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createNotificationsTable = `
    CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      message TEXT NOT NULL,
      target VARCHAR(50) DEFAULT 'all',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.query(createAdminTable, (err) => {
    if (err) {
      console.error("Admin table init error", err);
      return;
    }

    db.query("SELECT COUNT(*) AS count FROM admin", (err, result) => {
      if (err) {
        console.error("Admin seed check error", err);
        return;
      }

      if (result[0].count === 0) {
        const crypto = require("crypto");
        const passwordHash = crypto.createHash("sha256").update("admin123").digest("hex");
        db.query(
          "INSERT INTO admin (name, email, password) VALUES (?, ?, ?)",
          ["Super Admin", "admin@astrology.com", passwordHash],
          (insertErr) => {
            if (!insertErr) {
              console.log("Default admin created");
            }
          }
        );
      }
    });
  });

  db.query(createNotificationsTable, (err) => {
    if (err) {
      console.error("Notifications table init error", err);
    }
  });
}

initializeDatabase();

server.listen(5000, () => {
  console.log("Server Running on 5000");
});