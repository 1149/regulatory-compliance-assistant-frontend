/**
 * Delete confirmation dialog component
 */
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import DeleteIcon from '@mui/icons-material/Delete';

const DeleteConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  loading,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item?",
  itemName = "",
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(224, 227, 231, 0.5)',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center',
        color: '#d32f2f',
        fontWeight: 600
      }}>
        <WarningIcon sx={{ mr: 1, color: '#ff9800' }} />
        {title}
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {message}
        </Typography>
        {itemName && (
          <Box
            sx={{
              backgroundColor: '#fff3e0',
              border: '1px solid #ffcc02',
              borderRadius: 1,
              p: 2,
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 600,
                color: '#e65100'
              }}
            >
              {itemName}
            </Typography>
          </Box>
        )}
        <Typography 
          variant="body2" 
          sx={{ 
            mt: 2, 
            color: 'text.secondary',
            fontStyle: 'italic'
          }}
        >
          This action cannot be undone.
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : <DeleteIcon />}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
