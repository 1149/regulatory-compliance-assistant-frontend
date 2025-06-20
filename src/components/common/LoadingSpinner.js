/**
 * Reusable loading component with customizable text and icon
 */
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ 
  text = 'Loading...', 
  size = 40, 
  color = 'primary',
  textVariant = 'body2',
  sx = {} 
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        p: 3,
        ...sx
      }}
    >
      <CircularProgress size={size} color={color} />
      <Typography 
        variant={textVariant} 
        sx={{ 
          color: 'text.secondary',
          textAlign: 'center',
          fontWeight: 500
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
