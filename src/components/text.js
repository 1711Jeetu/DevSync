import React, { useState } from 'react';
import withWindowLogic from './withWindowLogic';
import { ref, set, remove } from "firebase/database";
import { database } from "../utils/firebaseConfig";
import styles from './Window.module.css';
import { Copy, Minimize2, Trash2, Lock, GripHorizontal } from 'lucide-react';

const TextComponent = ({ value, currentUserName, roomId, toggleMinimize, isCreator, handleCopy, handleDelete, handleTitleChange, toggleLock }) => {

  const [textContent, setTextContent] = useState(value?.content?.content || "");

  const handleTextChange = (e) => {
    const content = e.target.value;
    setTextContent(content);

    const windowRef = ref(database, `rooms/${roomId}/windows/${value.id}`);
    set(windowRef, {
      id: value.id,
      content: content,
      creater: value.creater,
      locked: value.locked,
      typeOfNode: value.typeOfNode,
      title: value.title
    });
  };

  return (
    <div
      className={styles.window}
    >
      <div
        className={styles.titleBar}
      >
        <GripHorizontal className={`${styles.dragHandle} drag-handle`} size={16} />
        <div className={styles.title} contentEditable suppressContentEditableWarning onBlur={handleTitleChange} ><span>{value?.title}</span></div>
        <div className={styles.controls}>
          <button
            onClick={() => toggleLock()}
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

  );
}
export default Text = withWindowLogic(TextComponent);