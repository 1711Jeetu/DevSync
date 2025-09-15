const express = require('express')
const {generateUsername} = require('../utils/usernameGenerator');
const { rooms } = require('../state');
const { db } = require('../services/firebase');

const router = express.Router();

router.post('/username', (req,res) => {
    const {roomId} = req.body;
    
    if (!roomId) {
        return res.status(400).json({ error: 'Room ID is required' });
    }

    if (!rooms[roomId]) {
        rooms[roomId] = new Set();
    }
    
    let username;
    do {
        username = generateUsername();
    } while (rooms[roomId].has(username));

    rooms[roomId].add(username);
    res.json({ username });
});

router.post('/rooms/create', async (req, res) => {
    const { roomId, password } = req.body;
    if (!roomId || !password) {
        return res.status(400).json({ error: 'Room ID and password are required' });
    }

    try {
        const roomRef = db.ref(`rooms/${roomId}`);
        const snapshot = await roomRef.once('value');

        if (snapshot.exists()) {
            return res.status(409).json({ error: 'Room ID already exists. Please choose another.' });
        }

        // In a production app, you should hash the password before storing it
        await roomRef.set({
            password: password,
            windows: {},
        });

        res.status(201).json({ message: 'Room created successfully', roomId });

    } catch (error) {
        console.error("Error creating room:", error);
        res.status(500).json({ error: 'Failed to create room on the server' });
    }
});


router.post('/rooms/join', async (req, res) => {
    const { roomId, password } = req.body;
    if (!roomId || !password) {
        return res.status(400).json({ error: 'Room ID and password are required' });
    }

    try {
        const roomRef = db.ref(`rooms/${roomId}`);
        const snapshot = await roomRef.once('value');

        if (snapshot.exists() && snapshot.val().password === password) {
            res.status(200).json({ message: 'Room join successful' });
        } else {
            res.status(401).json({ error: 'Invalid room ID or password' });
        }
    } catch (error) {
        console.error("Error joining room:", error);
        res.status(500).json({ error: 'Failed to join room on the server' });
    }
});

module.exports = router;
