import React, { useRef, useState } from "react";
import { ref, set, remove } from "firebase/database";
import { database } from "../utils/firebaseConfig";
import axios from "axios";
import { Editor } from "@monaco-editor/react";
import { FormGroup, FormControlLabel } from "@mui/material";
import MaterialUISwitch from "./CustomizedSwitch";
import Tooltip from '@mui/material/Tooltip';
import LongMenu from "./Dropdown";


function CodeComponent({ value, currentUserName, roomId ,toggleMinimize}) {
    const editorRef = useRef(null);
    const [language, setLanguage] = useState("python");
    const [output, setOutput] = useState("");
    const [theme, setTheme] = useState("vs-dark");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const iscreater = value.creater === currentUserName;
    const menuItems = [
        { name: "copy", value: <i className="fa-solid fa-copy fa-lg"></i>,onClick: () => handleCopy() },
        { name: "lock", value: value.locked ? (
          <i className="fa-solid fa-lock fa-lg"></i>
        ) : (
          <i className="fa-solid fa-lock-open fa-lg"></i>
        ),onClick:() => toggleLock() }
    ];

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

    const handleEditorChange = () => {
        
        const windowRef = ref(database, `rooms/${roomId}/windows/${value.id}`);
        set(windowRef, { id: value.id, content: editorRef.current.getValue(), creater: value.creater, locked: value.locked, typeOfNode: value.typeOfNode, title: value.title });
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
 
    };

    const toggleLock = () => {
        if (!iscreater) {
            alert("Only the creater can change the lock status.");
            return;
        }

        const windowRef = ref(database, `rooms/${roomId}/windows/${value.id}`);
        set(windowRef, { id: value.id, content: value.content.content, creater: value.creater, locked: !value.locked, typeOfNode: value.typeOfNode, title: value.title });
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


    const handleThemeChange = (event) => {
        setTheme(event.target.checked ? "vs-dark" : "light");
    };

    const handleTitleChange = (event) =>{
        const windowRef = ref(database, `rooms/${roomId}/windows/${value.id}`);
        set(windowRef, { id: value.id, content: value.content.content, creater: value.creater, locked: !value.locked, typeOfNode: value.typeOfNode, title: event.target.firstChild.textContent });
    }

    return (
        <div className="resizable-card ">
    <div className="card-body">
        {/* Header Section */}
        <div className="card-header">
            {/* Left Section: User Info and Switch */}
            <Tooltip title="Drag">
                <div className="dragging" style={{display:"inline-block",marginRight:"10px"}}>
                <i className="fa-solid fa-arrows-up-down-left-right fa-lg"></i>
                </div>
            </Tooltip>
            <div className="user-info" contentEditable onBlur={handleTitleChange}>
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
            <div className="controls">
                <select onChange={handleLanguageChange} value={language}>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="csharp">C#</option>
                    <option value="cpp">C++</option>
                    <option value="c">C</option>
                </select>
                <FormControlLabel
                className="theme-switch"
                    control={
                        <MaterialUISwitch
                        
                            checked={theme === "vs-dark"}
                            onChange={handleThemeChange}
                        />
                    }
                    label="Theme"
                />
                <button
                className="run-button"
                    onClick={executeCode}
                 
                >
                    <i className="fa-solid fa-play fa-xl"></i>
                </button>
            </div>

            
            <Editor
                className="resizable-editor"
                value={value?.content?.content}
                automaticLayout
                language={language}
                theme={theme}
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                options={{
                    readOnly: !iscreater && value.locked, // Makes the editor read-only for non-creators when locked
                    fontSize: 16,
                    fontFamily: 'Consolas',
                    lineHeight:1.5,
                }}
            />
            

            {/* Output */}
            <div className="output-container">
                <span>Output:</span>
                <pre>{output}</pre>
            </div>
        </div> 
        
    </div>
</div>

    )
}

export default CodeComponent;