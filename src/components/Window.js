import React, { useState, useRef } from 'react';
import { Copy, Minimize2, Trash2, Lock, GripHorizontal } from 'lucide-react';
import { ref, set, remove } from "firebase/database";
import { database } from "../utils/firebaseConfig";
import styles from './Window.module.css';
import DraggableComponent from "./DraggableComponent";



export const Text = ({ value, currentUserName, roomId,toggleMinimize }) => {
  const [title,setTitle] = useState(value.title)
  const [textContent, setTextContent] = useState(value?.content?.content || "");
  const isCreator = value.creater === currentUserName;

  const handleCopy = () => {
    navigator.clipboard.writeText(textContent);
    alert("Content copied to clipboard!");
  };

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

  const handleTitleChange = (event) =>{
    setTitle(event.target.firstChild.textContent);
    const windowRef = ref(database, `rooms/${roomId}/windows/${value.id}`);
    set(windowRef, { id: value.id, content: value.content.content, creater: value.creater, locked: !value.locked, typeOfNode: value.typeOfNode, title: event.target.firstChild.textContent });
}



  return (
    <DraggableComponent handle={`.${styles.dragHandle}`}>
    <div
      className={styles.window}
    >
      <div 
        className={styles.titleBar}
      >
        <GripHorizontal className={styles.dragHandle} size={16} />
        <div className={styles.title} contentEditable suppressContentEditableWarning onBlur={handleTitleChange} ><span>{value?.title}</span></div>
        <div className={styles.controls}>
          <button 
            onClick={() =>toggleLock()} 
            className={`${styles.control} ${value.locked ? styles.active : ''}`}
            title="Lock"
          >
            <Lock size={16} />
          </button>
          <button 
            onClick={handleCopy} 
            className={styles.control}
            title="Copy"
          >
            <Copy size={16} />
          </button>
          <button 
            onClick={handleDelete} 
            className={styles.control}
            title="Clear"
          >
            <Trash2 size={16} />
          </button>
          <button 
            onClick={toggleMinimize} 
            className={styles.control}
            title="Minimize"
          >
            <Minimize2 size={16} />
          </button>
        </div>
      </div>
      
        <textarea
          className={styles.textarea}
          value={value?.content?.content}
          onChange={handleTextChange}
          disabled={!isCreator && value.locked}
          placeholder='Start Writing'
        />
      
    </div>
    </DraggableComponent>
  );
}