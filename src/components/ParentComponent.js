import React from "react";
import Button from '@mui/material/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';




const ParentComponent = ({ children, addComponent }) => {
  return (
    
    <div>    
      <DropdownButton id="dropdown-basic-button" title="Add">
      <Dropdown.Item onClick={() => {addComponent("Text")}}>Text editor</Dropdown.Item>
      <Dropdown.Item onClick={() => {addComponent("Code")}}>Code editor</Dropdown.Item>
      <Dropdown.Item onClick={() => {addComponent("Canvas")}}>Canvas</Dropdown.Item>
    </DropdownButton>
      <div>{children}</div>
    </div>
  );
};

export default ParentComponent;
