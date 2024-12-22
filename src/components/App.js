import React, { useState, useEffect } from "react";
import { database } from "../utils/firebaseConfig";
import { ref, push, onValue, get, off, set } from "firebase/database";
import { generateUsername } from "../utils/usernameGenerator";
import RoomManager from "./RoomManager";
import ParentComponent from "./ParentComponent";
import ChildrenComponent from "./ChildrenComponent";
import "../App.css"
import Button from '@mui/material/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Sidebar from "./Sidebar";
import TextField from '@mui/material/TextField';
import ButtonGroup from '@mui/material/ButtonGroup';
import LongMenu from "./Dropdown";

function App() {

    const [childrenData, setChildrenData] = useState([]);
    const [username, setUsername] = useState("");
    const [roomId, setRoomId] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [window, setWindows] = useState([]);
    const [minimizedWindows, setMinimizedWindows] = useState([]);
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setTitle("");
    };
    const menuItems = [
        { name: "Username", value: username },
        { name: "Room ID", value: roomId },
        { name: "Exit", value: "Exit", onClick: () => handleExit() }
    ];


    useEffect(() => {
        // Generate a username if it doesn't exist
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        } else {
            const newUsername = generateUsername();
            setUsername(newUsername);
            localStorage.setItem("username", newUsername); // Persist in local storage
        }
    }, [roomId]);

    useEffect(() => {
        const storedRoomId = localStorage.getItem("roomId");
        if (storedRoomId) {
            setRoomId(storedRoomId)
        }
        if (!roomId) return;
        const fetchData = async () => {
            try {
                const snapshot = await get(ref(database, `rooms/${roomId}/windows`));
                const data = snapshot.val();
                if (data) {
                    const parsedData = Object.entries(data).map(([id, value]) => ({
                        id, content: { content: value.content },
                        creater: value.creater, locked: value.locked, typeOfNode: value.typeOfNode, title: value.title
                    }));
                    setChildrenData(parsedData);


                }
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
        fetchData();
    }, [roomId]);

    useEffect(() => {
        const storedRoomId = localStorage.getItem("roomId");
        if (storedRoomId) {
            setRoomId(storedRoomId)
        }
        if (!roomId) return;
        const windowRef = ref(database, `rooms/${roomId}/windows`);

        const unsubscribe = onValue(windowRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const parsedData = Object.entries(data).map(([id, value]) => ({
                    id, content: { content: value.content },
                    creater: value.creater, locked: value.locked, typeOfNode: value.typeOfNode, title: value.title
                }));
                setChildrenData(parsedData);

                const windows = Object.entries(data).map(([id, value]) => ({
                    id,title:value.title
                }));
                setWindows(windows);


            }
        });

        return () => off(windowRef);
    }, [roomId]);

    function createWindow(node) {
        if (!roomId) {
            alert("first join a room");
            return;
        }
        if (!title.trim()) { // Check if the title is empty or contains only whitespace
            alert("Please enter a title for the window.");
            return;
        }
        const windowRef = ref(database, `rooms/${roomId}/windows`);
        const newWindowRef = push(windowRef);
        const newWindowData = { id: newWindowRef.key, title: title, content: "", creater: username, locked: true, typeOfNode: node };
        set(newWindowRef, newWindowData);
        handleClose();

    };

    const handleRoomJoin = (selectedRoomId) => {
        setRoomId(selectedRoomId);
        localStorage.setItem("roomId", selectedRoomId);
    };
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleMinimizeWindow = (id) => {
        setMinimizedWindows((prev) => [...prev, id]); // Add the window to minimized list
    };

    const restoreWindow = (id) => {
        setMinimizedWindows((prev) => prev.filter((windowId) => windowId !== id)); // Remove from minimized list
    };
    const handleChange = (event) => {
        setTitle(event.target.value); // Update the state with the TextField's value
    };

    const handleExit = () => {
        setRoomId(null);
        localStorage.removeItem("roomId");
    }



    return (
        <>
            <div className="App">
                {!roomId ? (
                    <RoomManager onRoomJoin={handleRoomJoin} />
                ) : (
                    <div>
                        <header>

                            <div className="left">
                                <button onClick={toggleSidebar} style={{color:"white"}}><i className="fa-solid fa-bars"></i></button>
                                <Button onClick={handleOpen} style={{color:"white"}}>Add</Button>
                                <Modal
                                    keepMounted
                                    open={open}
                                    onClose={handleClose}
                                    aria-labelledby="keep-mounted-modal-title"
                                    aria-describedby="keep-mounted-modal-description"
                                >
                                    <Box sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: 400,
                                        bgcolor: 'background.paper',
                                        border: '2px solid #000',
                                        boxShadow: 24,
                                        pt: 2,
                                        px: 4,
                                        pb: 3,
                                    }}>
                                        <TextField id="standard-basic" label="Window Title" variant="standard" value={title} // Controlled input
                                            onChange={handleChange} style={{marginBottom:"10px"}}/>
                                        <ButtonGroup variant="contained" aria-label="Basic button group">
                                            <Button onClick={() => { createWindow("Text") }}>Text editor</Button>
                                            <Button onClick={() => { createWindow("Code") }}>Code editor</Button>
                                            <Button onClick={() => { createWindow("Canvas") }}>Canvas</Button>
                                        </ButtonGroup>

                                    </Box>
                                </Modal>

                            </div>
                            <div className="middle">DevSync</div>
                            <div className="right" >
                                <LongMenu menuItems={menuItems} />
                            </div>

                        </header>


                        <div className="content">
                            <Sidebar isOpen={sidebarOpen} windows={window} onRestore={restoreWindow} toggleSidebar={toggleSidebar}/>


                            <ParentComponent >
                                {childrenData.filter((data) => !minimizedWindows.includes(data.id))
                                    .map((data) => (
                                        <ChildrenComponent
                                            key={data.id}
                                            value={data}
                                            currentUserName={username}
                                            roomId={roomId}
                                            TypeOfNode={data.typeOfNode}
                                            toggleMinimize={() => toggleMinimizeWindow(data.id)}
                                        />
                                    ))}
                            </ParentComponent>
                        </div>
                    </div>
                )}



            </div>
            <footer style={{ position: "fixed", bottom: 0, textAlign: "center", justifyContent: "center", width: "100%", backgroundColor: "#333", color: "white", fontSize: "large", fontFamily: "Courier new" }}>under Development<br />
                report issues at:<a href="https://github.com/HirenKhatri7/DevSync">github</a>
            </footer>
        </>
    );
}

export default App;
