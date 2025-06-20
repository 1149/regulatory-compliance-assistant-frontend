/**
 * Reusable error display component
 */
import React from 'react';
import { Alert, Box, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ErrorDisplay = ({ 
  error, 
  onRetry = null, 
  retryText = 'Try Again',
  severity = 'error',
  sx = {}
}) => {
  return (
    <Box sx={{ p: 2, ...sx }}>
      <Alert 
        severity={severity} 
        icon={<ErrorOutlineIcon />}
        action={
          onRetry && (
            <Button color="inherit" size="small" onClick={onRetry}>
              {retryText}
            </Button>
          )
        }
      >
        {error}
      </Alert>
    </Box>
  );
};

export default ErrorDisplay;
