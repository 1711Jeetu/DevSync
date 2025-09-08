import React,{useState} from "react";
import {ref,set,remove} from "firebase/database";
import {database} from "../utils/firebaseConfig";
import DraggableComponent from "./DraggableComponent";

const withWindowLogic = (WindowedComponent) => {
    return (props) => {
        const {value, currentUserName, roomId, toggleMinimize} = props;
        const [title,setTitle] = useState(value.title);
        const isCreator = value.creater === currentUserName;

        const handleCopy = () => {
            navigator.clipboard.writeText(value?.content?.content || "");
        }

        const handleDelete = async () => {
            if(!isCreator){
                alert("you cannot delete this window");
                return;
            }
            try{
                const windowRef = ref(database, `rooms/${roomId}/windows/${value.id}`);
                await remove(windowRef);
            } catch(error){
                console.error("Error deleting card: ", error);
                alert("Failed to delete the card.");
            }
        }

        const toggleLock = () => {
            if(!isCreator){
                alert("you cannot delete this window");
                return;
            }
            const windowRef = ref(database, `rooms/${roomId}/windows/${value.id}`);
            set(windowRef, {
                id: value.id,
                content: value?.content?.content,
                creater: value.creater,
                locked: !value.locked,
                typeOfNode: value.typeOfNode,
                title: value.title    
            });
        };

        const handleTitleChange = (event) => {
            setTitle(event.target.firstChild.textContent);
            const windowRef = ref(database, `rooms/${roomId}/windows/${value.id}`);
            set(windowRef, { id: value.id, content: value.content.content, creater: value.creater, locked: !value.locked, typeOfNode: value.typeOfNode, title: event.target.firstChild.textContent });

        };
        return (
            <DraggableComponent handle=".drag-handle">
                <WindowedComponent
                    {...props}
                    isCreator = {isCreator}
                    handleDelete = {handleDelete}
                    toggleLock = {toggleLock}
                    handleTitleChange = {handleTitleChange}
                    handleCopy = {handleCopy}
                    title = {title}
                ></WindowedComponent>
            </DraggableComponent>
            
        )
    }
}

export default withWindowLogic;