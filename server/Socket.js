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
    try {
      // Expecting channels like 'cursor-update:<roomId>'
      if (channel.startsWith('cursor-update:')) {
        const roomId = channel.split(':')[1];
        const data = JSON.parse(message);
        // Emit to everyone in the room except the sender; use a consistent event name
        io.to(roomId).except(data.senderId).emit('cursor:update', data);
      }
    } catch (err) {
      console.error('Error processing Redis message:', err);
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