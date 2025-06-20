/**
 * Upload Success Dialog Component
 * 
 * Displays a confirmation dialog when documents are successfully uploaded,
 * providing user feedback and next steps.
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
  Chip,
  Divider,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const UploadSuccessDialog = ({ 
  open, 
  onClose, 
  fileName, 
  subject,
  fileSize,
  uploadTime 
}) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUploadTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
          pb: 2,
          background: 'linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%)',
          borderRadius: '12px 12px 0 0',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <CheckCircleOutlineIcon 
            sx={{ 
              fontSize: 48, 
              color: 'success.main',
              filter: 'drop-shadow(0 2px 4px rgba(76, 175, 80, 0.3))'
            }} 
          />
          <Typography variant="h5" component="h2" sx={{ color: 'success.dark', fontWeight: 600 }}>
            Upload Successful!
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* File Information */}
          <Box sx={{ 
            p: 2, 
            borderRadius: 2, 
            background: '#f8fafc',
            border: '1px solid #e2e8f0'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <DescriptionIcon color="primary" />
              <Typography variant="subtitle1" fontWeight={600}>
                Document Details
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  File Name:
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {fileName}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Subject:
                </Typography>
                <Chip 
                  label={subject} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  sx={{ borderRadius: 1 }}
                />
              </Box>
              
              {fileSize && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    File Size:
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {formatFileSize(fileSize)}
                  </Typography>
                </Box>
              )}
              
              {uploadTime && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Uploaded:
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {formatUploadTime(uploadTime)}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          <Divider />

          {/* Next Steps */}
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
              <AutoAwesomeIcon color="secondary" />
              <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                What's Next?
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              Your document has been successfully processed and is now available in the Document Library. 
              You can now:
            </Typography>
            
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" color="text.primary">
                • Generate AI-powered summaries
              </Typography>
              <Typography variant="body2" color="text.primary">
                • Extract and analyze entities
              </Typography>
              <Typography variant="body2" color="text.primary">
                • Chat with your document using AI
              </Typography>
              <Typography variant="body2" color="text.primary">
                • Search across all uploaded documents
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2, gap: 1 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ minWidth: 100 }}
        >
          Close
        </Button>
        <Button 
          onClick={onClose}
          variant="contained"
          startIcon={<CloudUploadIcon />}
          sx={{ minWidth: 140 }}
        >
          View Document Library
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadSuccessDialog;
