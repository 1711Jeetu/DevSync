import React, { useRef, useState } from "react";
import { ref, set, remove } from "firebase/database";
import DraggableComponent from "./DraggableComponent";
import { database } from "../utils/firebaseConfig";
import Editor from "@monaco-editor/react";
import axios from "axios";
import DrawingComponent from "./DrawingComponent"; 
import Avatar from '@mui/material/Avatar';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';


const ChildrenComponent = ({ value, currentUserName, roomId }) => {

    const editorRef = useRef(null);
    const [Type, setType] = useState("text");
    const [language, setLanguage] = useState("python");
    const [output, setOutput] = useState("");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [fontSize, setFontSize] = useState("16px");
    const [fontStyle, setFontStyle] = useState("Arial");
    const [theme, setTheme] = useState("vs-dark");
    const iscreater = value.creater === currentUserName;

    const languageSettings = {
        python: { fileName: 'main.py', version: '3.10.0' },
        java: { fileName: 'Main.java', version: '15.0.2' },
        csharp: { fileName: 'Program.cs', version: '9.0' },
        cpp: { fileName: 'main.cpp', version: '10.2.0' },
        c: { fileName: 'main.c', version: '10.2.0' },
    };

    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
    };

    const handleChange = (e) => {
        if (!iscreater && value.locked) {
            alert("You cannot edit this content as the window is locked.");
            return;
        }
        const windowRef = ref(database, `rooms/${roomId}/windows/${value.id}`);
        set(windowRef, { id: value.id, content: e.target.value, creater: value.creater, locked: value.locked });
    };

    const handleEditorChange = () => {
        if (!iscreater && value.locked) {
            alert("You cannot edit this content as the window is locked.");
            return;
        }
        const windowRef = ref(database, `rooms/${roomId}/windows/${value.id}`);
        set(windowRef, { id: value.id, content: editorRef.current.getValue(), creater: value.creater, locked: value.locked });
    }
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
    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
        console.log(languageSettings[language]);
        console.log(languageSettings);
    };

    const toggleLock = () => {
        if (!iscreater) {
            alert("Only the creater can change the lock status.");
            return;
        }

        const windowRef = ref(database, `rooms/${roomId}/windows/${value.id}`);
        set(windowRef, { id: value.id, content: value.content.content, creater: value.creater, locked: !value.locked });
    };

    const handleCopy = () => {
        
        navigator.clipboard.writeText(value.content.content);
    }

    const executeCode = async () => {
        const code = editorRef.current.getValue();
        const { fileName, version } = languageSettings[language];
        const program = {
            language: language,
            version: version,
            files: [
                {
                    name: fileName,
                    content: code,
                },
            ],
        };

        try {
            const response = await axios.post('https://emkc.org/api/v2/piston/execute', program, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setOutput(response.data.run.output);
        } catch (error) {
            console.error('Error executing code:', error);
            setOutput('Error executing code');
        }
    };

    const toggleSettings = () => {
        setIsSettingsOpen(!isSettingsOpen);
    };

    const applyTextStyle = {
        fontSize,
        fontFamily: fontStyle,
    };




    return (
        <DraggableComponent handle="strong">
            <div className="card resizable-card border-0">
                <div className="card-body">
                    <div className="mb-2">
                        <strong style={{display:"inline-block"}}><Avatar /></strong> <span id="userId" style={{position: "relative", top: "-10px",left:"4px"}}>{value?.creater}</span>
                        <button onClick={(e) => {
                            handleDelete(e);
                        }
                        } style={{ backgroundColor: "transparent", color: "red", border: "none", cursor: "pointer", float: "right" }}>
                            <i class="fa-solid fa-trash fa-xl"></i>
                        </button>
                        
                    </div>
                    <select className="form-select" aria-label="Select Type" onChange={(e) => setType(e.target.value)}>
                        <option value="text">Text</option>
                        <option value="code">Code</option>
                        <option value="canvas">Canvas</option>
                    </select>
                    <button onClick={handleCopy}style={{ backgroundColor: "transparent", border: "none",float:"right"}}><i class="fa-solid fa-copy fa-xl"></i></button>
                    <br />
                    <button onClick={toggleLock} style={{ backgroundColor: "transparent", border: "none"}}>
                        {value.locked ? <i class="fa-solid fa-lock fa-lg"></i>: <i class="fa-solid fa-lock-open fa-lg"></i>}
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
                            <label>Theme:</label>
                            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                                <option value="vs-dark">Dark</option>
                                <option value="light">Light</option>
                            </select>
                            <button onClick={toggleSettings}>Close</button>
                        </div>
                    )}
                    <hr />
                    {(() => {
                        if (Type === "text") {
                            return <textarea
                                style={applyTextStyle}
                                className="form-control"
                                rows={5}
                                placeholder="Enter your text here"
                                defaultValue={value?.content?.content}
                                onChange={handleChange}
                                disabled = {value.locked && !iscreater}
                            />;
                        } else if (Type === "code") {
                            return <>
                                <select onChange={handleLanguageChange} value={language} >
                                    <option value="python">Python</option>
                                    <option value="java">Java</option>
                                    <option value="csharp">C#</option>
                                    <option value="cpp">C++</option>
                                    <option value="c">C</option>
                                </select>
                                <button onClick={executeCode} style={{border:"none",backgroundColor:"transparent",float:"right",marginRight:"4px",marginBottom:"4px",color:"rgb(49, 150, 38)"}}><i class="fa-solid fa-play fa-xl"></i></button>
                                <Editor
                                    automaticLayout
                                    language={language}
                                    theme={theme}
                                    defaultValue={value?.content?.content}
                                    onChange={handleEditorChange}
                                    onMount={handleEditorDidMount} 
                                    options={{ fontSize: parseInt(fontSize, 10) }}
                                />
                                <div>
                                    <span>Output:</span>
                                    <pre>{output}</pre>
                                </div>
                                </>
                        }
                        else {
                            return <DrawingComponent />
                        }
                    })()}


                </div>
            </div>
        </DraggableComponent>
    );
};

export default ChildrenComponent;
