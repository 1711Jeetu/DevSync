import React, { useRef, useState } from "react";
import { ref, set, remove } from "firebase/database";
import { database } from "../utils/firebaseConfig";
import { Avatar } from "@mui/material";


function TextComponent({ value, currentUserName,roomId }) {

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [fontSize, setFontSize] = useState("16px");
    const [fontStyle, setFontStyle] = useState("Arial");
    const iscreater = value.creater === currentUserName;


    const handleChange = (e) => {
        if (!iscreater && value.locked) {
            alert("You cannot edit this content as the window is locked.");
            return;
        }
        const windowRef = ref(database, `rooms/${roomId}/windows/${value.id}`);
        console.log(e.target.value);
        set(windowRef, { id: value.id, content: e.target.value, creater: value.creater, locked: value.locked, typeOfNode : value.typeOfNode });
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

    const toggleSettings = () => {
        setIsSettingsOpen(!isSettingsOpen);
    };

    const applyTextStyle = {
        fontSize,
        fontFamily: fontStyle,
    };

    return (
        <div className="card resizable-card border-0">
            <div className="card-body">
                <div className="mb-2">
                    <strong style={{ display: "inline-block" }}><Avatar /></strong> <span id="userId" style={{ position: "relative", top: "-10px", left: "4px" }}>{value?.creater}</span>
                    <button onClick={(e) => {
                        handleDelete(e);
                    }
                    } style={{ backgroundColor: "transparent", color: "red", border: "none", cursor: "pointer", float: "right" }}>
                        <i class="fa-solid fa-trash fa-xl"></i>
                    </button>

                </div>
                <button onClick={handleCopy} style={{ backgroundColor: "transparent", border: "none", float: "right" }}><i class="fa-solid fa-copy fa-xl"></i></button>
                <br />
                <button onClick={toggleLock} style={{ backgroundColor: "transparent", border: "none" }}>
                    {value.locked ? <i class="fa-solid fa-lock fa-lg"></i> : <i class="fa-solid fa-lock-open fa-lg"></i>}
                </button>
                <button onClick={toggleSettings} style={{ float: "right", border: "none", backgroundColor: "transparent" }}>
                    <i className="fa-solid fa-gear fa-lg"></i>
                </button>
                {isSettingsOpen && (
                    <div style={{
                        position: "absolute",
                        top: "50px",
                        right: "10px",
                        width: "200px",
                        backgroundColor: "#f9f9f9",
                        padding: "10px",
                        borderRadius: "4px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                    }}>
                        <h5>Settings</h5>
                        <label>Font Size:</label>
                        <select value={fontSize} onChange={(e) => setFontSize(e.target.value)}>
                            <option value="12px">12px</option>
                            <option value="14px">14px</option>
                            <option value="16px">16px</option>
                            <option value="18px">18px</option>
                        </select>
                        <br />
                        <label>Font Style:</label>
                        <select value={fontStyle} onChange={(e) => setFontStyle(e.target.value)}>
                            <option value="Arial">Arial</option>
                            <option value="Courier New">Courier New</option>
                            <option value="Times New Roman">Times New Roman</option>
                        </select>
                        <br />

                        <button onClick={toggleSettings}>Close</button>
                    </div>
                )}
                <hr />

                <textarea
                    style={applyTextStyle}
                    className="form-control"
                    rows={5}
                    placeholder="Enter your text here"
                    defaultValue={value?.content?.content}
                    onChange={handleChange}
                    disabled={value.locked && !iscreater}
                />
            </div>
        </div>
    );
}

export default TextComponent;