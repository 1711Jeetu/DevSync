import React, { useRef, useState } from "react";
import DraggableComponent from "./DraggableComponent";
import DrawingComponent from "./DrawingComponent"; 
import TextComponent from "./TextComponent";
import CodeComponent from "./CodeComponent";



const ChildrenComponent = ({ value, currentUserName, roomId, TypeOfNode,toggleMinimize }) => {

    


    return (
       
        <DraggableComponent handle=".dragging">
           
                    {(() => {
                        if (TypeOfNode === "Text") {
                            return <TextComponent
                            value={value}
                            currentUserName={currentUserName}
                            roomId={roomId}
                            toggleMinimize = {toggleMinimize}/>
                        } else if (TypeOfNode === "Code") {
                            return <CodeComponent
                            value={value}
                            currentUserName={currentUserName}
                            roomId={roomId}
                            toggleMinimize = {toggleMinimize} />
                        }
                        else {
                            return <DrawingComponent
                            value={value}
                            currentUserName={currentUserName}
                            roomId={roomId}
                            toggleMinimize = {toggleMinimize} />
                        }
                    })()}
        </DraggableComponent>
    );
};

export default ChildrenComponent;
