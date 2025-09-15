const express = require('express');
const http = require('http');
const cors = require('cors');
const session = require('express-session')
const {RedisStore} = require('connect-redis');
const {RedisPublisher} = require('./services/Redis');
const { initializeSocket } = require('./Socket'); // Updated path
const apiRoutes = require('./routes/api');


// --- Basic Setup ---
const app = express();
const server = http.createServer(app);


// --- Middleware ---
app.use(cors({ origin: "http://localhost:3000"}));
app.use(express.json());


// --- API Routes ---
app.use('/api', apiRoutes);

// --- Initialize Socket.IO and its handlers ---
initializeSocket(server);


// --- Start Server ---
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
