import React, { useState } from "react";
import { database } from "../utils/firebaseConfig";
import { ref, set, get, child } from "firebase/database";
import styles from "./RoomManager.module.css";
import {
  Button,
  TextField,
} from "@mui/material";

const JoinCreateCard = ({ onRoomJoin, type }) => {
  const [roomId, setRoomId] = useState("");
  const [password, setPassword] = useState("");
  const [newRoomId, setNewRoomId] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleJoinRoom = async () => {
    const dbRef = ref(database);
    const roomSnapshot = await get(child(dbRef, `rooms/${roomId}`));
    if (roomSnapshot.exists() && roomSnapshot.val().password === password) {
      onRoomJoin(roomId);
    } else {
      alert("Invalid room ID or password");
    }
  };

  const handleCreateRoom = async () => {
    await set(ref(database, `rooms/${newRoomId}`), {
      password: newPassword,
      windows: {},
    });
    onRoomJoin(newRoomId);
  };

  if (type === "Join") {
    return (
      <div id={styles.roomJoinCard}>
        <div className={styles.flexColumn}>
          <h2 className={styles.marginTop10px}>Join Room</h2>
          <TextField
            margin="normal"
            id="outlined-basic"
            label="Room id"
            variant="outlined"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />

          <TextField
            id="outlined-basic"
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
          id="outlined-basic"
          label="New Room ID"
          variant="outlined"
          value={newRoomId}
          onChange={(e) => setNewRoomId(e.target.value)}
        />

        <TextField
          id="outlined-basic"
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
