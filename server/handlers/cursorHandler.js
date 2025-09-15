const { RedisPublisher } = require("../services/Redis");

function handleCursorEvents(socket, io) {
  socket.on('cursor:move', (data) => {
    const payload = { ...data, senderId: socket.id };
    RedisPublisher.publish(`cursor-update:${data.roomId}`, JSON.stringify(payload));
  });
}

module.exports = handleCursorEvents;