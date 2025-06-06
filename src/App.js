import React from 'react';
import Navbar from './components/Navbar';
import './App.css'; 
// Import MUI Container and Typography
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import FileUpload from './components/FileUpload';
import DocumentList from './components/DocumentList'; // NEW: Import DocumentList


function App() {
  return (
    <div>
      <Navbar /> {/* Your MUI Navbar component */}
      {/* Replace <main> and your old container div with MUI Container */}
      <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4, p: 3, backgroundColor: 'white', borderRadius: 2, boxShadow: 3 }}>
        {/* Using MUI Typography for headings and paragraphs */}
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to your Regulatory Compliance Assistant!
        </Typography>
        <Typography variant="body1" paragraph>
          Upload documents here to get started. Our AI will help you understand and comply with regulations.
        </Typography>
        {/* You'll add more components here later, like file upload forms etc. */}
        <FileUpload />
        <DocumentList /> {/* NEW: Add DocumentList component to display uploaded documents */}
      </Container>
    </div>
  );
}

export default App;
