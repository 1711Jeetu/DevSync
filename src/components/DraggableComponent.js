import React, { forwardRef } from "react";
import Draggable from "react-draggable";

const DraggableComponent = forwardRef((props, ref) => (
  <Draggable {...props}>
    <div ref={ref}>{props.children}</div>
  </Draggable>
));

export default DraggableComponent;
