import React, { useState, useEffect } from "react";
import { database } from "../utils/firebaseConfig";
import { ref, push, onValue, get, off,set} from "firebase/database";
import { generateUsername } from "../utils/usernameGenerator";
import RoomManager from "./RoomManager";
import ParentComponent from "./ParentComponent";
import ChildrenComponent from "./ChildrenComponent";
import "../App.css"
import Button from '@mui/material/Button';


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
        if (!roomId) return;
        const fetchData = async () => {
            try {
                const snapshot = await get(ref(database, `rooms/${roomId}/windows`));
                const data = snapshot.val();
                if (data) {
                    const parsedData = Object.entries(data).map(([id, value]) => ({
                        id, content: { content: value.content },
                        creater: value.creater, locked: value.locked, typeOfNode : value.typeOfNode
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
        if (!roomId) return;
        const windowRef = ref(database, `rooms/${roomId}/windows`);

        const unsubscribe = onValue(windowRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const parsedData = Object.entries(data).map(([id, value]) => ({
                    id, content: { content: value.content },
                    creater: value.creater, locked: value.locked, typeOfNode : value.typeOfNode
                }));
                setChildrenData(parsedData);
                
            }
        });

        return () => off(windowRef);
    }, [roomId]);

   function createWindow(node){
        if (!roomId) {
            alert("first join a room");
            return;
        }
        const windowRef = ref(database, `rooms/${roomId}/windows`);
        const newWindowRef = push(windowRef);
        const newWindowData = { id: newWindowRef.key, content: "", creater: username, locked: true,typeOfNode : node };
        set(newWindowRef, newWindowData);
    };

    const handleRoomJoin = (selectedRoomId) => {
        setRoomId(selectedRoomId);
    };

    return (
        <>
        <div className="App">
            {!roomId ? (
                <RoomManager onRoomJoin={handleRoomJoin} />
            ) : (
                <div>
                    <header>
                    <div className="left"><span><h2 style={{display:"inline-block"}}>Room: {roomId}</h2></span></div>
                    <div className="middle">DevSync</div>
                    <div className="right"><Button onClick={() => setRoomId(null)} style={{float:"right",display:"inline-block",color:"red"}}><i className="fa-solid fa-arrow-right-to-bracket fa-2xl"></i></Button></div>
                    </header>
                    <hr/>
     
                    <ParentComponent addComponent={createWindow}>
                        {childrenData.map((data) => (
                            <ChildrenComponent
                                key={data.id}
                                value={data}
                                currentUserName={username}
                                roomId={roomId}
                                TypeOfNode = {data.typeOfNode}
                            />
                        ))}
                    </ParentComponent>
                </div>
            )}

            

        </div>
        <footer style={{position: "fixed",bottom:0,textAlign:"center",justifyContent:"center",width:"100%",backgroundColor:"#333",color:"white",fontSize:"large",fontFamily:"Courier new"}}>Made by Hiren Khatri,Sagar kukreja,Akshay ahuja Styled by manish ghindwani and sourav mitrani
            honourable mention jeetu mamtora
        </footer>
        </>
    );
}

export default App;
