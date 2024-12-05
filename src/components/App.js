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


function App() {

    const [childrenData, setChildrenData] = useState([]);
    const [username, setUsername] = useState("");
    const [roomId, setRoomId] = useState('');


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
        if(storedRoomId){
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
                        creater: value.creater, locked: value.locked, typeOfNode: value.typeOfNode
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
        if(storedRoomId){
            setRoomId(storedRoomId)
        }
        if (!roomId) return;
        const windowRef = ref(database, `rooms/${roomId}/windows`);

        const unsubscribe = onValue(windowRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const parsedData = Object.entries(data).map(([id, value]) => ({
                    id, content: { content: value.content },
                    creater: value.creater, locked: value.locked, typeOfNode: value.typeOfNode
                }));
                setChildrenData(parsedData);

            }
        });

        return () => off(windowRef);
    }, [roomId]);

    function createWindow(node) {
        if (!roomId) {
            alert("first join a room");
            return;
        }
        const windowRef = ref(database, `rooms/${roomId}/windows`);
        const newWindowRef = push(windowRef);
        const newWindowData = { id: newWindowRef.key, content: "", creater: username, locked: true, typeOfNode: node };
        set(newWindowRef, newWindowData);
    };

    const handleRoomJoin = (selectedRoomId) => {
        setRoomId(selectedRoomId);
        localStorage.setItem("roomId", selectedRoomId);
    };

    return (
        <>
            <div className="App">
                {!roomId ? (
                    <RoomManager onRoomJoin={handleRoomJoin} />
                ) : (
                    <div>
                        <header>
                            <div className="left"><span><h2 >Room: {roomId}</h2></span>
                                <DropdownButton id="dropdown-basic-button" title="Add" className="add-button">
                                    <Dropdown.Item onClick={() => { createWindow("Text") }}>Text editor</Dropdown.Item>
                                    <Dropdown.Item onClick={() => { createWindow("Code") }}>Code editor</Dropdown.Item>
                                    <Dropdown.Item onClick={() => { createWindow("Canvas") }}>Canvas</Dropdown.Item>
                                </DropdownButton>

                            </div>
                            <div className="middle">DevSync</div>
                            <div className="right"><Button onClick={() => {setRoomId(null);
                                localStorage.removeItem("roomId");
                            }} ><i className="fa-solid fa-arrow-right-to-bracket fa-2xl"></i></Button></div>
                        </header>
                        

                        {/*left panel for storing the windows*/}


                        <ParentComponent >
                            {childrenData.map((data) => (
                                <ChildrenComponent
                                    key={data.id}
                                    value={data}
                                    currentUserName={username}
                                    roomId={roomId}
                                    TypeOfNode={data.typeOfNode}
                                />
                            ))}
                        </ParentComponent>
                    </div>
                )}



            </div>
            <footer style={{ position: "fixed", bottom: 0, textAlign: "center", justifyContent: "center", width: "100%", backgroundColor: "#333", color: "white", fontSize: "large", fontFamily: "Courier new" }}>under Development<br/>
                report issues at:<a href="https://github.com/HirenKhatri7/DevSync">github</a>
            </footer>
        </>
    );
}

export default App;
