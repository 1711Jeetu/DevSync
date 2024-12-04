import React, { useRef, useState } from "react";
import DraggableComponent from "./DraggableComponent";
import DrawingComponent from "./DrawingComponent"; 
import TextComponent from "./TextComponent";
import CodeComponent from "./CodeComponent";



const ChildrenComponent = ({ value, currentUserName, roomId, TypeOfNode }) => {


    return (
       
        <DraggableComponent handle=".card-header">
                    {(() => {
                        if (TypeOfNode === "Text") {
                            return <TextComponent
                            value={value}
                            currentUserName={currentUserName}
                            roomId={roomId}/>
                        } else if (TypeOfNode === "Code") {
                            return <CodeComponent
                            value={value}
                            currentUserName={currentUserName}
                            roomId={roomId} />
                        }
                        else {
                            return <DrawingComponent
                            value={value}
                            currentUserName={currentUserName}
                            roomId={roomId} />
                        }
                    })()}
        </DraggableComponent>
    );
};

export default ChildrenComponent;
