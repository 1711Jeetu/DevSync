import React, { useRef, useState } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

const DrawingComponent = () => {
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 300 });
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [isEraser, setIsEraser] = useState(false);

  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
    }
  };

  const undoLastStroke = () => {
    if (canvasRef.current) {
      canvasRef.current.undo();
    }
  };

  const saveDrawing = async () => {
    if (canvasRef.current) {
      const imageData = await canvasRef.current.exportImage("png");
      console.log("Drawing saved as a base64 string:", imageData);
      // Optionally, save it to a backend or display it in the app
    }
  };

  const handleStrokeWidthChange = (e) => {
    setStrokeWidth(e.target.value);
  };

  const toggleEraser = () => {
    setIsEraser((prev) => !prev);
    setSelectedColor(isEraser ? "#000000" : "#FFFFFF"); // Change to white or transparent color for erasing
  };

;

  return (
    <div style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <ResizableBox
        width={canvasSize.width}
        height={canvasSize.height}
        minConstraints={[200, 200]}
        maxConstraints={[800, 800]}
        resizeHandles={["s", "e", "se"]}
        onResizeStop={(e, data) => {
          setCanvasSize({ width: data.size.width, height: data.size.height });
        }}
        style={{ border: "1px solid #000", borderRadius: "8px", overflow: "hidden" }}
      >
        <ReactSketchCanvas
          ref={canvasRef}
          width={`${canvasSize.width}px`}
          height={`${canvasSize.height}px`}
          style={{ width: "100%", height: "100%" }}
          strokeWidth={strokeWidth}
          strokeColor={selectedColor}
          eraseMode={isEraser}
          shape={"freehand"}
        />
      </ResizableBox>
      <div style={{ marginTop: "10px" }}>
        <button onClick={clearCanvas} style={{ marginRight: "10px", border: "none", backgroundColor: "transparent" }}>
          <i className="fa-regular fa-trash-can"></i>
        </button>
        <button onClick={undoLastStroke} style={{ marginRight: "10px", border: "none", backgroundColor: "transparent" }}>
          <i className="fa-solid fa-rotate-left"></i>
        </button>
        <button onClick={saveDrawing} style={{ border: "none", backgroundColor: "transparent" }}>
          <i className="fa-solid fa-download"></i>
        </button>
        <input
          type="color"
          value={selectedColor}
          onChange={handleColorChange}
          style={{ marginLeft: "10px", border: "none", backgroundColor: "transparent" }}
        />
        <button onClick={toggleEraser} style={{ marginLeft: "10px", border: "none", backgroundColor: "transparent" }}>
          {isEraser ? <i className="fa-solid fa-pencil"></i> : <i className="fa-solid fa-eraser"></i>}
        </button>
        <input
          type="range"
          min="1"
          max="10"
          value={strokeWidth}
          onChange={handleStrokeWidthChange}
          style={{ marginLeft: "10px" }}
        />
        <span style={{ marginLeft: "10px" }}>Stroke Width: {strokeWidth}</span>
      
      </div>
    </div>
  );
};

export default DrawingComponent;
