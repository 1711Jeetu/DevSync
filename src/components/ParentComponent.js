import React from "react";
import Button from '@mui/material/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';




const ParentComponent = ({ children}) => {
  return (
    
    <div className="parent-component">    
      {children}
    </div>
  );
};

export default ParentComponent;
