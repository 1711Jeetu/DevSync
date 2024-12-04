import React, { useRef, useState } from "react";
import { ref, set, remove } from "firebase/database";
import { database } from "../utils/firebaseConfig";
import { Avatar } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"
import Tooltip from '@mui/material/Tooltip';



function TextComponent({ value, currentUserName,roomId }) {

    const [quillContent, setQuillContent] = useState(value?.content?.content || "");
    const iscreater = value.creater === currentUserName;


    const handleQuillChange = (content) => {
        
        setQuillContent(content);
        const windowRef = ref(database, `rooms/${roomId}/windows/${value.id}`);
        set(windowRef, { 
            id: value.id, 
            content: content, 
            creater: value.creater, 
            locked: value.locked, 
            typeOfNode : value.typeOfNode
        });
    };

    const handleDelete = async (e) => {
        if (!iscreater) {
            alert("You cannot delete this window.");
            return;
        }
        try {
            const windowRef = ref(database, `rooms/${roomId}/windows/${value.id}`);
            await remove(windowRef);

        }
        catch (error) {
            console.error("Error deleting card:", error);
            alert("Failed to delete the card");
        }
    }

    const toggleLock = () => {
        if (!iscreater) {
            alert("Only the creater can change the lock status.");
            return;
        }

        const windowRef = ref(database, `rooms/${roomId}/windows/${value.id}`);
        set(windowRef, { id: value.id, content: value.content.content, creater: value.creater, locked: !value.locked, typeOfNode : value.typeOfNode });
    };

    const handleCopy = () => {

        navigator.clipboard.writeText(value.content.content);
    }


    return (
        <div className="card resizable-card border-0">
            <div className="card-body">
            <div className="card-header">
            {/* Left Section: User Info and Switch */}<div className="user-info">
                <Avatar /><span id="userId" className="user-name">{value?.creater}</span>
                
                
                
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
                    <i className="fa-solid fa-trash fa-xl" ></i>
                </button>
                 </Tooltip>
                
                <Tooltip title="copy as html">
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
                
                <ReactQuill
                    
                    value={value?.content?.content}
                    onChange={handleQuillChange}
                    theme="snow"
                    readOnly={!iscreater && value.locked}
                    
                />

                </div>
                
            </div>
        </div>
    );
}

export default TextComponent;