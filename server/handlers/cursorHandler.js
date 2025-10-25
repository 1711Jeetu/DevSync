const { RedisPublisher } = require("../services/Redis");
const { rooms } = require('../state');

function handleCursorEvents(socket, io) {
  socket.on('cursor:move', (data) => {
    try {
      const roomId = data.roomId;
      const username = socket.username || data.userId || socket.id;
      const userInfo = rooms[roomId] && rooms[roomId][username];
      const color = userInfo ? userInfo.color : '#000000';

      // Build canonical payload (do not trust client-sent username)
      const payload = {
        userId: username,
        windowId: data.windowId,
        x: data.x,
        y: data.y,
        color,
        senderId: socket.id,
        roomId,
      };

      RedisPublisher.publish(`cursor-update:${roomId}`, JSON.stringify(payload));
    } catch (err) {
      console.error('Error handling cursor move:', err);
    }
  });
}

module.exports = handleCursorEvents;