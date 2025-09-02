import React, { useState } from "react";
import { ref, set, remove } from "firebase/database";
import { database } from "../utils/firebaseConfig";
import Tooltip from "@mui/material/Tooltip";
import LongMenu from "./Dropdown";

function TextComponent({ value, currentUserName, roomId,toggleMinimize }) {
  const [textContent, setTextContent] = useState(value?.content?.content || "");
  const isCreator = value.creater === currentUserName;
  const menuItems = [
    { name: "copy", value: <i className="fa-solid fa-copy fa-lg"></i>,onClick: () => handleCopy() },
    { name: "lock", value: value.locked ? (
      <i className="fa-solid fa-lock fa-lg"></i>
    ) : (
      <i className="fa-solid fa-lock-open fa-lg"></i>
    ),onClick:() => toggleLock() }
];
  

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
      title: value.title
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
      content: value?.content?.content,
      creater: value.creater,
      locked: !value.locked,
      typeOfNode: value.typeOfNode,
      title: value.title
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(textContent);
    alert("Content copied to clipboard!");
  };
  const handleTitleChange = (event) =>{
          const windowRef = ref(database, `rooms/${roomId}/windows/${value.id}`);
          set(windowRef, { id: value.id, content: value.content.content, creater: value.creater, locked: !value.locked, typeOfNode: value.typeOfNode, title: event.target.firstChild.textContent });
      }

  return (
    <div className="resizable-card ">
      <div className="card-body">
        <div className="card-header">
          {/* Left Section: User Info */}
          <Tooltip title="Drag">
                <div className="dragging" style={{display:"inline-block",marginRight:"10px"}}>
                <i className="fa-solid fa-arrows-up-down-left-right fa-lg"></i>
                </div>
            </Tooltip>
          <div className="user-info"  contentEditable onBlur={handleTitleChange}>
            <span>{value?.title}</span>
          </div>

          {/* Right Section: Buttons */}
          <div className="action-buttons">
          
            <Tooltip title="Minimize">
            <button onClick={toggleMinimize}>
              <i className="fa-solid fa-window-minimize"></i>
            </button>
            </Tooltip>
           
            <Tooltip title="Delete">
              <button onClick={handleDelete}>
                <i className="fa-solid fa-trash fa-lg"></i>
              </button>
            </Tooltip>

            
            <LongMenu menuItems={menuItems}/>
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
