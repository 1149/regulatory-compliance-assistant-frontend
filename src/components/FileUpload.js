import React, { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; // For a nice upload icon
import { styled } from '@mui/material/styles'; // For custom button styling

// Styled component for the upload button (MUI's way to create custom styled elements)
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function FileUpload({ onUploadSuccess }) { // <-- Accept the prop
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setUploadStatus(`Selected file: ${event.target.files[0].name}`);
    } else {
      setSelectedFile(null);
      setUploadStatus('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first!');
      return;
    }

    setUploadStatus('Uploading...');
    const formData = new FormData();
    formData.append('file', selectedFile); // 'file' matches the parameter name in your FastAPI endpoint

    try {
      // IMPORTANT: Replace with your actual backend URL (e.g., http://localhost:8000/api/upload-document/)
      const response = await fetch('http://127.0.0.1:8000/api/upload-document/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadStatus(`Upload successful: ${data.filename}`);
        // Clear selected file after successful upload
        setSelectedFile(null);
        if (onUploadSuccess) {
          onUploadSuccess(); // <-- Call the prop to refresh the document list
        }
      } else {
        const errorData = await response.json();
        setUploadStatus(`Upload failed: ${errorData.detail || response.statusText}`);
      }
    } catch (error) {
      setUploadStatus(`Network error: ${error.message}`);
      console.error('Upload error:', error);
    }
  };

  return (
    <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Typography variant="h6">Upload a Regulatory Document</Typography>
      <Button
        component="label" // This makes the button act as a label for the hidden input
        variant="contained"
        startIcon={<CloudUploadIcon />}
      >
        {selectedFile ? selectedFile.name : 'Choose File'}
        <VisuallyHiddenInput type="file" onChange={handleFileChange} />
      </Button>
      {selectedFile && (
        <Typography variant="body2" color="text.secondary">
          File: {selectedFile.name}
        </Typography>
      )}
      <Button
        variant="outlined"
        onClick={handleUpload}
        disabled={!selectedFile} // Disable button if no file is selected
      >
        Upload
      </Button>
      {uploadStatus && (
        <Typography variant="body2" sx={{ mt: 2, color: uploadStatus.includes('successful') ? 'success.main' : 'error.main' }}>
          {uploadStatus}
        </Typography>
      )}
    </Box>
  );
}

export default FileUpload;