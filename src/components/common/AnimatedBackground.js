/**
 * Animated background component with video and fallback
 */
import React from 'react';
import { Box } from '@mui/material';

const AnimatedBackground = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Video Background */}
      <Box
        component="video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -2,
          opacity: 0.6,
          filter: 'brightness(0.8) contrast(1.1)',
        }}
        onError={(e) => {
          // Fallback if video fails to load
          e.target.style.display = 'none';
        }}
      >
        <source src="/background-animation.mp4" type="video/mp4" />
      </Box>
      
      {/* Fallback Background */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          zIndex: -3,
        }}
      />
      
      {/* Dark Overlay for Better Text Contrast */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.3) 0%, rgba(45, 45, 45, 0.2) 50%, rgba(30, 30, 30, 0.4) 100%)',
          zIndex: -1,
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AnimatedBackground;
