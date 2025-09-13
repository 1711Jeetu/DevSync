import React, { useState, useMemo,useRef } from 'react';
import withWindowLogic from './withWindowLogic';
import { ref, set, remove } from "firebase/database";
import { database } from "../utils/firebaseConfig";
import styles from './Window.module.css';
import { Copy, Minimize2, Trash2, Lock, GripHorizontal,MousePointer2 } from 'lucide-react';
import { socket } from '../utils/Socket';
import throttle from 'lodash.throttle';


const TextComponent = ({ value, currentUserName, roomId, toggleMinimize, isCreator, handleCopy, handleDelete, handleTitleChange, toggleLock,cursors }) => {

  const [textContent, setTextContent] = useState(value?.content?.content || "");
  const windowRef = useRef(null)
const handleMouseMove = (e) => {
    // Check if the ref is attached to an element
    if (!windowRef.current) return;
    console.log(windowRef.current)

    const { left, top } = windowRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    throttledEmit({
      roomId,
      userId: currentUserName,
      windowId: value.id,
      x,
      y,
    });
  };
    const throttledEmit = useMemo(
    () =>
      throttle((data) => {
        console.log(data)
        socket.emit('cursor:move', data);
      }, 50),
    [roomId, currentUserName, value.id] // Dependencies for the throttled function
  );

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
      ref={windowRef}
      onMouseMove={handleMouseMove}
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
      {Object.entries(cursors).map(([userId, { x, y, windowId }]) => {
        // Only render cursor if it belongs to the current window
        if (windowId !== value.id) return null;

        return (
          <div
            key={userId}
            className="cursor"
            style={{
              position: 'absolute',
              left: `${x}px`,
              top: `${y}px`,
            }}
          >
            {/* Optional: display the user's name */}
            <span style={{ marginLeft: '15px' }}><MousePointer2 fill='black'/></span>
          </div>
        );
      })}


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