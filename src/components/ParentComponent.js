import React from "react";
import Button from '@mui/material/Button';

const ParentComponent = ({ children, addComponent }) => {
  return (
    <div>    
        <Button onClick={addComponent} ><i class="fa-solid fa-circle-plus fa-3x"></i></Button>
      <div>{children}</div>
    </div>
  );
};

export default ParentComponent;
