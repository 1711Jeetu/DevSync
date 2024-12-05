import React, { useState } from "react";
import { ref, set, remove } from "firebase/database";
import { database } from "../utils/firebaseConfig";
import { Avatar } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

function TextComponent({ value, currentUserName, roomId }) {
  const [textContent, setTextContent] = useState(value?.content?.content || "");
  const isCreator = value.creater === currentUserName;
  

  const handleTextChange = (e) => {
    const content = e.target.value;
    setTextContent(content);

    const windowRef = ref(database, `rooms/${roomId}/windows/${value.id}`);
    set(windowRef, {
      id: value.id,
      content:  content ,
      creater: value.creater,
      locked: value.locked,
      typeOfNode: value.typeOfNode,
    });
  };

  const handleDelete = async () => {
    if (!isCreator) {
      alert("You cannot delete this window.");
      return;
    }

    try {
      const windowRef = ref(database, `rooms/${roomId}/windows/${value.id}`);
      await remove(windowRef);
    } catch (error) {
      console.error("Error deleting card:", error);
      alert("Failed to delete the card");
    }
  };

  const toggleLock = () => {
    if (!isCreator) {
      alert("Only the creator can change the lock status.");
      return;
    }

    const windowRef = ref(database, `rooms/${roomId}/windows/${value.id}`);
    set(windowRef, {
      id: value.id,
      content: textContent,
      creater: value.creater,
      locked: !value.locked,
      typeOfNode: value.typeOfNode,
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(textContent);
    alert("Content copied to clipboard!");
  };

  return (
    <div className="card resizable-card border-0">
      <div className="card-body">
        <div className="card-header">
          {/* Left Section: User Info */}
          <div className="user-info">
            <Avatar />
            <span id="userId" className="user-name">{value?.creater}</span>
          </div>

          {/* Right Section: Buttons */}
          <div className="action-buttons">
          <Tooltip title="Drag">
                <div className="dragging" style={{display:"inline-block",marginRight:"10px"}}>
                <i className="fa-solid fa-arrows-up-down-left-right fa-xl"></i>
                </div>
            </Tooltip>
            <Tooltip title="Delete">
              <button onClick={handleDelete}>
                <i className="fa-solid fa-trash fa-xl"></i>
              </button>
            </Tooltip>

            <Tooltip title="Copy as Text">
              <button onClick={handleCopy}>
                <i className="fa-solid fa-copy fa-xl"></i>
              </button>
            </Tooltip>

            <Tooltip title="Lock Window">
              <button onClick={toggleLock}>
                {value.locked ? (
                  <i className="fa-solid fa-lock fa-lg"></i>
                ) : (
                  <i className="fa-solid fa-lock-open fa-lg"></i>
                )}
              </button>
            </Tooltip>
          </div>
        </div>

        <div className="card-content">
          <textarea
            value={value?.content?.content}
            onChange={handleTextChange}
            readOnly={!isCreator && value.locked} // Disable editing if locked or not the creator
            className="textarea-editor"
            
            style={{
              
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default TextComponent;
