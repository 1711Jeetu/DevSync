import React, { useRef, useState } from "react";
import { ref, set, remove } from "firebase/database";
import { database } from "../utils/firebaseConfig";
import axios from "axios";
import { Avatar } from "@mui/material";
import { Editor } from "@monaco-editor/react";
import { FormGroup, FormControlLabel } from "@mui/material";
import MaterialUISwitch from "./CustomizedSwitch";
import Tooltip from '@mui/material/Tooltip';


function CodeComponent({ value, currentUserName, roomId }) {
    const editorRef = useRef(null);
    const [language, setLanguage] = useState("python");
    const [output, setOutput] = useState("");
    const [theme, setTheme] = useState("vs-dark");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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

    const handleEditorChange = () => {
        if (!iscreater && value.locked) {
            alert("You cannot edit this content as the window is locked.");
            return;
        }
        const windowRef = ref(database, `rooms/${roomId}/windows/${value.id}`);
        set(windowRef, { id: value.id, content: editorRef.current.getValue(), creater: value.creater, locked: value.locked, typeOfNode: value.typeOfNode });
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
        set(windowRef, { id: value.id, content: value.content.content, creater: value.creater, locked: !value.locked, typeOfNode: value.typeOfNode });
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

    return (
        <div className="card resizable-card border-0">
    <div className="card-body">
        {/* Header Section */}
        <div className="card-header">
            {/* Left Section: User Info and Switch */}
            <div className="user-info">
                
                <Avatar />
                <span id="userId" className="user-name">{value?.creater}</span>
                
                {/* Dark Mode Switch */}
                <FormControlLabel
                    control={
                        <MaterialUISwitch
                            checked={theme === "vs-dark"}
                            onChange={handleThemeChange}
                        />
                    }
                    label="Dark Mode"
                />
            </div>

            {/* Right Section: Buttons */}
            <div className="action-buttons">
                 <Tooltip title="Delete">
                 <button onClick={handleDelete}>
                    <i className="fa-solid fa-trash fa-xl" style={{ color: "red" }}></i>
                </button>
                 </Tooltip>
                
                <Tooltip title="copy to clipboard">
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

        
        
            <hr style={{marginTop:"60px",paddingTop:"10px",visibility:"hidden"}}/>

            
            <>
                <select onChange={handleLanguageChange} value={language}>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="csharp">C#</option>
                    <option value="cpp">C++</option>
                    <option value="c">C</option>
                </select>
                <button
                    onClick={executeCode}
                    style={{
                        border: "none",
                        backgroundColor: "transparent",
                        float: "right",
                        marginRight: "4px",
                        marginBottom: "4px",
                        color: "rgb(49, 150, 38)",
                    }}
                >
                    <i className="fa-solid fa-play fa-xl"></i>
                </button>
            </>

            
            <Editor
                automaticLayout
                height={"60%"}
                language={language}
                theme={theme}
                defaultValue={value?.content?.content}
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                options={{
                    readOnly: !iscreater && value.locked, // Makes the editor read-only for non-creators when locked
                }}
            />

            {/* Output */}
            <div>
                <span>Output:</span>
                <pre>{output}</pre>
            </div>
        
    </div>
</div>

    )
}

export default CodeComponent;