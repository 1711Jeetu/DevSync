import React, { useState, useEffect } from "react";
import RoomManager from "./RoomManager";
import ParentComponent from "./ParentComponent";
import ChildrenComponent from "./ChildrenComponent";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Sidebar from "./Sidebar";
import TextField from '@mui/material/TextField';
import ButtonGroup from '@mui/material/ButtonGroup';
import LongMenu from "./Dropdown";
import '../App.css'
import { socket } from "../utils/Socket";
import axios from "axios";

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
    const [cursors,setCursors] = useState({});
    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        // Only connect if we have both a room and a user
        if (roomId && username) {
            socket.connect();
            socket.emit('joinRoom', roomId);
            socket.emit('registerUsername', { roomId, username });

            // Listener for cursor updates
            socket.on('cursor:update', (data) => {
                const { userId, x, y, windowId, color } = data;
                setCursors(prevCursors => ({
                    ...prevCursors,
                    [userId]: { x, y, windowId, color }
                }));
            });

            // Listener for presence / participants updates
            socket.on('presence:update', ({ participants }) => {
                setParticipants(participants || []);
            });

            // Listener for initial window data
            socket.on('windows:load', (windowsData) => {
                const parsedData = windowsData ? Object.values(windowsData) : [];
                console.log(parsedData);
                setChildrenData(parsedData);
                setWindows(parsedData.map(w => ({ id: w.id, title: w.title })));
            });

            // Listener for real-time window updates
            socket.on('windows:update', (windowsData) => {
                const parsedData = windowsData ? Object.values(windowsData) : [];
                setChildrenData(parsedData);
                setWindows(parsedData.map(w => ({ id: w.id, title: w.title })));
            });
        }

        // Cleanup function: This runs when the component unmounts or dependencies change
        return () => {
            socket.off("cursor:update");
            socket.off('presence:update');
            socket.off('windows:load');
            socket.off('windows:update');
            socket.disconnect();
        }
    }, [roomId, username]); 



    useEffect(() => {
        const storedRoomId = localStorage.getItem("roomId");
        const storedUsername = localStorage.getItem("username");
        if (storedRoomId && storedUsername) {
            setRoomId(storedRoomId);
            setUsername(storedUsername);
        }
    }, []);
    


    function createWindow(node) {
        if (!roomId) {
            alert("first join a room");
            return;
        }
        if (!title.trim()) { // Check if the title is empty or contains only whitespace
            alert("Please enter a title for the window.");
            return;
        }

        const newWindowData = { title: title, content: "", creater: username, locked: true, typeOfNode: node };
        socket.emit('window:create', newWindowData);
        handleClose();

    };

    const handleRoomJoin = async (selectedRoomId) => {
        try {
            const response = await axios.post('http://localhost:4000/api/username', { roomId: selectedRoomId });
            const newUsername = response.data.username;
            
            localStorage.setItem("roomId", selectedRoomId);
            localStorage.setItem("username", newUsername);

            setRoomId(selectedRoomId);
            setUsername(newUsername);
        } catch (error) {
            console.error("Failed to fetch username for new room:", error);
        }
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
        localStorage.removeItem("roomId");
        localStorage.removeItem("username");
        setRoomId('');
        setUsername('');
    };



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
                            <Sidebar isOpen={sidebarOpen} windows={window} participants={participants} onRestore={restoreWindow} toggleSidebar={toggleSidebar}/>


                            <ParentComponent cursors = {cursors}>
                                {childrenData.filter((data) => !minimizedWindows.includes(data.id))
                                    .map((data) => (
                                        <ChildrenComponent
                                            key={data.id}
                                            value={data}
                                            currentUserName={username}
                                            roomId={roomId}
                                            TypeOfNode={data.typeOfNode}
                                            toggleMinimize={() => toggleMinimizeWindow(data.id)}
                                            cursors = {cursors}
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
