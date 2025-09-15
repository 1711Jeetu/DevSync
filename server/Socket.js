const { Server } = require("socket.io");
const { RedisSubscriber } = require("./services/Redis");
const handleCursorEvents = require("./handlers/cursorHandler");
const handleRoomEvents = require("./handlers/roomHandler");
const { rooms } = require('./state');
const handleWindowEvents = require("./handlers/windowHandler");

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  // Central Redis listener
  RedisSubscriber.on('message', (channel, message) => {
    if (channel.startsWith('cursor-updates:')) {
      const roomId = channel.split(':')[1];
      const data = JSON.parse(message);
      io.to(roomId).except(data.senderId).emit(`cursor-update`,data);
    }
  });

  // Connection handler
  const onConnection = (socket) => {
    
    console.log("Client connected: ", socket.id);
    
    // Register all event handlers for the new socket connection
    handleRoomEvents(socket, io);

    
    socket.on('disconnect', () => {
        console.log("Client disconnected: ", socket.id);
    });
  }

  io.on("connection", onConnection);

  return io;
}

module.exports = { initializeSocket };