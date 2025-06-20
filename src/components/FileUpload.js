import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import UploadSuccessDialog from './dialogs/UploadSuccessDialog';

const BACKEND_BASE_URL = 'http://localhost:8000';

function FileUpload({ onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [subject, setSubject] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  // Success dialog state
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [uploadDetails, setUploadDetails] = useState({
    fileName: '',
    subject: '',
    fileSize: 0,
    uploadTime: null
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
      ];
      if (!allowedTypes.includes(file.type)) {
        setUploadStatus('Only PDF, Word (.doc, .docx), or TXT files are allowed!');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setUploadStatus('');
    } else {
      setSelectedFile(null);
      setUploadStatus('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !subject.trim()) {
      setUploadStatus('Please select a file and enter a subject/type.');
      return;
    }
    setIsUploading(true);
    setUploadStatus('Uploading...');
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('subject', subject);    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/upload-document/`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        // Store upload details for success dialog
        setUploadDetails({
          fileName: selectedFile.name,
          subject: subject,
          fileSize: selectedFile.size,
          uploadTime: new Date().toISOString()
        });
        
        // Show success dialog instead of status message
        setShowSuccessDialog(true);
        setUploadStatus('');
        setSelectedFile(null);
        setSubject('');
        
        if (onUploadSuccess) onUploadSuccess();
      } else {
        setUploadStatus('Upload failed.');
      }
    } catch (error) {
      setUploadStatus('Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    setUploadDetails({
      fileName: '',
      subject: '',
      fileSize: 0,
      uploadTime: null
    });
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 700, // Match the search UI width
        p: { xs: 2, sm: 4 },
        borderRadius: 4,
        boxShadow: 3,
        background: '#f8fafc',
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
      }}
    >
      <Alert
        severity="info"
        sx={{
          mb: 2,
          fontSize: '0.98rem',
          background: '#e3f2fd',
          color: '#1565c0',
          borderRadius: 2,
          alignItems: 'center'
        }}
      >
        <strong>Note:</strong> Please enter a clear subject or type for your document (e.g., "HR Policy", "Data Privacy", "Employee Handbook").
      </Alert>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Document Subject/Type"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          required
          fullWidth
          placeholder="E.g., HR Policy, Data Privacy"
        />
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          sx={{ minWidth: 140, height: '56px' }}
        >
          {selectedFile ? selectedFile.name : 'Choose File'}
          <input
            type="file"
            hidden
            accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
            onChange={handleFileChange}
          />
        </Button>
      </Box>
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 1, mt: 2, width: '100%' }}
        onClick={handleUpload}
        disabled={!selectedFile || !subject.trim() || isUploading}
      >
        {isUploading ? 'Uploading...' : 'Upload'}
      </Button>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <InfoOutlinedIcon color="info" sx={{ mr: 1, fontSize: 18 }} />
        <Typography variant="caption" color="text.secondary">
          Only PDF, Word (.doc, .docx), or TXT files are accepted
        </Typography>
      </Box>      {uploadStatus && (
        <Typography
          variant="body2"
          sx={{ mt: 2, color: uploadStatus.includes('successful') ? 'success.main' : 'error.main' }}
        >
          {uploadStatus}
        </Typography>
      )}
      
      {/* Success Dialog */}
      <UploadSuccessDialog
        open={showSuccessDialog}
        onClose={handleCloseSuccessDialog}
        fileName={uploadDetails.fileName}
        subject={uploadDetails.subject}
        fileSize={uploadDetails.fileSize}
        uploadTime={uploadDetails.uploadTime}
      />
    </Box>
  );
}

export default FileUpload;