// src/components/Navbar.js
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

function Navbar() {
  return (
    <AppBar position="static" sx={{ background: '#23272f' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
          Compliance Assistant
        </Typography>
        {/* Only show Uploaded Documents, remove Home and Settings */}
        <Button
          color="inherit"
          startIcon={<InsertDriveFileIcon sx={{ fontSize: 28 }} />}
          sx={{ fontSize: 18, textTransform: 'none', ml: 2 }}
        >
          Uploaded Documents
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;