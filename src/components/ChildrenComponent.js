import  {Code}  from "./CodeEditor";
import  Text  from "./text";



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
                            return <Code
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
