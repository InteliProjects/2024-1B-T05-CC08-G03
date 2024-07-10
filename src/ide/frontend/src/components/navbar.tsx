import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import axeImage from '../../../../assets/img/axe.png';

function Navbar() {
  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#708090' }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'center' }}>
          <img src={axeImage.src} alt="Axe" style={{ height: '90px'}} />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;