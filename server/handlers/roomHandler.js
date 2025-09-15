const { RedisSubscriber } = require("../services/Redis");
const { rooms } = require('../state');// We'll export 'rooms' from the main socket file
const handleCursorEvents = require("./cursorHandler");
const handleWindowEvents = require("./windowHandler");

function handleRoomEvents(socket, io) {
  socket.on("joinRoom", (roomId) => {
    socket.roomId = roomId;
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
    handleCursorEvents(socket, io);
    handleWindowEvents(socket, io); 
    RedisSubscriber.subscribe(`cursor-update:${roomId}`);
  });

  socket.on('registerUsername', ({ roomId, username }) => {
    socket.username = username;
    console.log(rooms,roomId);
    if (!rooms[roomId]) {
      rooms[roomId] = new Set();
    }
    rooms[roomId].add(username);
    console.log(`Socket ${socket.id} registered as ${username} in room ${roomId}`);
  });

  socket.on('disconnect', () => {
    // Clean up the username from the room
    if (socket.username) {
      for (const roomId in rooms) {
        if (rooms[roomId].has(socket.username)) {
          rooms[roomId].delete(socket.username);
          console.log(`User ${socket.username} removed from room ${roomId}`);
          break;
        }
      }
    }
  });
}

module.exports = handleRoomEvents;