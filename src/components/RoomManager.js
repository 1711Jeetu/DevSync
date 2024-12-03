import React, { useState } from "react";
import styles from "./RoomManager.module.css";
import {
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import JoinCreateCard from "./JoinCreateCard";

const RoomManager = ({ onRoomJoin }) => {
  const [alignment, setAlignment] = React.useState("web");
  const [cardType, setCardType] = useState("Join");

  const handleChange = (event, newAlignment) => {
    setCardType(event.target.value);
    setAlignment(newAlignment);
  };

  return (
    <div className={styles.mainContent}>
      <ToggleButtonGroup
        className={styles.toggleButtonGroup}
        color="primary"
        value={alignment}
        exclusive
        onChange={handleChange}
        aria-label="Platform"
      >
        <ToggleButton value="Join">Join Room</ToggleButton>
        <ToggleButton value="Create">Create Room</ToggleButton>
      </ToggleButtonGroup>
      <JoinCreateCard onRoomJoin={onRoomJoin} type={cardType} />
    </div>
  );
};

export default RoomManager;
