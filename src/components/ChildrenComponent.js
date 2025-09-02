import { CodeEditor } from "./CodeEditor";
import { Text } from "./Window";



const ChildrenComponent = ({ value, currentUserName, roomId, TypeOfNode,toggleMinimize }) => {

    


    return (
       
       
           
                    (() => {
                        if (TypeOfNode === "Text") {
                            return <Text
                            value={value}
                            currentUserName={currentUserName}
                            roomId={roomId}
                            toggleMinimize = {toggleMinimize}/>
                        } else if (TypeOfNode === "Code") {
                            return <CodeEditor
                            value={value}
                            currentUserName={currentUserName}
                            roomId={roomId}
                            toggleMinimize = {toggleMinimize} />
                        }
                        // else {
                        //     return <DrawingComponent
                        //     value={value}
                        //     currentUserName={currentUserName}
                        //     roomId={roomId}
                        //     toggleMinimize = {toggleMinimize} />
                        // }
                    })()
        
    );
};

export default ChildrenComponent;
