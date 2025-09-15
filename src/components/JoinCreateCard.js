import React, { useState } from "react";
import styles from "./RoomManager.module.css";
import {
  Button,
  TextField,
} from "@mui/material";
import api from "../utils/api";

const JoinCreateCard = ({ onRoomJoin, type }) => {
  const [roomId, setRoomId] = useState("");
  const [password, setPassword] = useState("");
  const [newRoomId, setNewRoomId] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleJoinRoom = async () => {
    if (!roomId || !password) {
      alert("Please enter a Room ID and password.");
      return;
    }
    try {
      // 1. Ask the backend to validate the room credentials
      await api.post('/rooms/join', { roomId, password });
      // 2. If validation is successful, call onRoomJoin, which will create the user session
      onRoomJoin(roomId);
    } catch (error) {
      console.error("Error joining room:", error);
      alert(error.response?.data?.error || "Failed to join room.");
    }
  };

  const handleCreateRoom = async () => {
    if (!newRoomId || !newPassword) {
      alert("Please enter a new Room ID and password.");
      return;
    }
    try {
      // 1. Ask the backend to create the new room
      await api.post('/rooms/create', { roomId: newRoomId, password: newPassword });
      // 2. If creation is successful, join the new room
      onRoomJoin(newRoomId);
    } catch (error) {
      console.error("Error creating room:", error);
      alert(error.response?.data?.error || "Failed to create room.");
    }
  };

  if (type === "Join") {
    return (
      <div id={styles.roomJoinCard}>
        <div className={styles.flexColumn}>
          <h2 className={styles.marginTop10px}>Join Room</h2>
          <TextField
            margin="normal"
            id="outlined-basic-join-roomId"
            label="Room id"
            variant="outlined"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />

          <TextField
            id="outlined-basic-join-roomPassword"
            label="password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={handleJoinRoom}
            size="large"
            style={ { marginTop : '15%'}}
          >
            Join Room
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div id={styles.roomJoinCard}>
        <h2 className={styles.marginTop10px}>Create Room</h2>

        <TextField
          margin="normal"
          id="outlined-basic-create-roomId"
          label="New Room ID"
          variant="outlined"
          value={newRoomId}
          onChange={(e) => setNewRoomId(e.target.value)}
        />

        <TextField
          id="outlined-basic-create-roomPassword"
          type="password"
          label="password"
          variant="outlined"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <Button
          variant="contained"
          onClick={handleCreateRoom}
          size="large"
          className={styles.marginTop10px}
          style={ { marginTop : '15%'}}
        >
          Create Room
        </Button>
    </div>
  );
};

export default JoinCreateCard;
