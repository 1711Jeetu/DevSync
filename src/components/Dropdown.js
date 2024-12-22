import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';




export default function LongMenu({roomId ,username ,handleExit,menuItems}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="menu-container">
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon className='three-dot-icon'/>
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        className="menu"
        onClose={handleClose}
        slotProps={{
          paper: {
           
          },
        }}
      >
         

          {menuItems.map((item, index) => (
        <MenuItem
          
          key={index}
          onClick={item.onClick ? item.onClick : undefined} // Conditionally apply onClick if available
        >
          {item.value}
        </MenuItem>
      ))}

       
      </Menu>
    </div>
  );
}
