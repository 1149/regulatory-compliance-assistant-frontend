import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import FileUpload from './components/FileUpload';
import DocumentList from './components/DocumentList';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';

function App() {
  // State for semantic search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // State for documents
  const [documents, setDocuments] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [documentsError, setDocumentsError] = useState(null);

  // NEW: State for Policy Analyzer
  const [userPolicyText, setUserPolicyText] = useState('');
  const [policyAnalysisResult, setPolicyAnalysisResult] = useState(null);
  const [policyAnalysisLoading, setPolicyAnalysisLoading] = useState(false);
  const [policyAnalysisError, setPolicyAnalysisError] = useState(null);

  // Fetch documents function
  const fetchDocuments = async () => {
    setDocumentsLoading(true);
    setDocumentsError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/documents/');
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      const data = await response.json();
      setDocuments(data);
    } catch (err) {
      setDocumentsError(err.message);
    } finally {
      setDocumentsLoading(false);
    }
  };

  // Fetch documents on initial load
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Semantic search handler
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    setSearchLoading(true);
    setSearchError(null);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/search/semantic/?query=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Search failed: ${errorData.detail || response.statusText}`);
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      setSearchError(`Error during semantic search: ${error.message}.`);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // NEW: Handle Policy Analysis Submission
  const handlePolicyAnalysis = async () => {
    if (!userPolicyText.trim() || policyAnalysisLoading) {
      return;
    }

    setPolicyAnalysisLoading(true);
    setPolicyAnalysisError(null);
    setPolicyAnalysisResult(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/analyze-policy/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ policy_text: userPolicyText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Policy analysis failed: ${errorData.detail || response.statusText}`);
      }
      const data = await response.json();
      setPolicyAnalysisResult(data);

    } catch (error) {
      setPolicyAnalysisError(`Error during policy analysis: ${error.message}`);
    } finally {
      setPolicyAnalysisLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4, p: 3, backgroundColor: 'white', borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Regulatory Compliance Assistant
        </Typography>
        <Typography variant="body1" paragraph>
          Upload documents or search existing ones to find relevant information and insights.
        </Typography>

        {/* --- File Upload Section --- */}
        <Box sx={{ mb: 4, mt: 4 }}>
          <FileUpload onUploadSuccess={fetchDocuments} />
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* --- Semantic Search Section --- */}
        <Typography variant="h5" gutterBottom>
          Semantic Search
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            label="Search by meaning..."
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <Button variant="contained" onClick={handleSearch} disabled={searchLoading}>
            {searchLoading ? <CircularProgress size={24} /> : 'Search'}
          </Button>
        </Box>

        {searchError && (
          <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
            {searchError}
          </Typography>
        )}

        {searchResults.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Search Results
            </Typography>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {searchResults.map((doc, index) => (
                <React.Fragment key={doc.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Typography
                          sx={{ display: 'inline' }}
                          component="span"
                          variant="subtitle1"
                          color="text.primary"
                        >
                          {doc.filename} (ID: {doc.id})
                        </Typography>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: 'block', mt: 0.5 }}
                            component="span"
                            variant="body2"
                            color="text.secondary"
                          >
                            Status: {doc.status} | Uploaded: {new Date(doc.upload_date).toLocaleString()}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  {index < searchResults.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}

        <Divider sx={{ my: 4 }} />

        {/* --- NEW: Policy Analysis Section --- */}
        <Typography variant="h5" gutterBottom>
          Policy Compliance Analyzer
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          <TextField
            label="Paste your policy text here for analysis..."
            variant="outlined"
            multiline
            rows={6}
            fullWidth
            value={userPolicyText}
            onChange={(e) => setUserPolicyText(e.target.value)}
          />
          <Button variant="contained" onClick={handlePolicyAnalysis} disabled={policyAnalysisLoading}>
            {policyAnalysisLoading ? <CircularProgress size={24} /> : 'Analyze Policy'}
          </Button>
        </Box>

        {policyAnalysisError && (
          <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
            {policyAnalysisError}
          </Typography>
        )}

        {policyAnalysisResult && (
          <Box sx={{ mt: 2, p: 2, border: '1px dashed #ccc', borderRadius: 2, bgcolor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom>Compliance Analysis Status</Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              <strong>Status:</strong> {policyAnalysisResult.status || 'N/A'}<br/>
              <strong>Message:</strong> {policyAnalysisResult.message || 'No message'}<br/>
              {policyAnalysisResult.received_text_length && (
                <span><strong>Text Length:</strong> {policyAnalysisResult.received_text_length} characters</span>
              )}
            </Typography>

            {/* This is where actual AI suggestions will go in later steps */}
            {/* For example, if policyAnalysisResult.suggestions is an array: */}
            {policyAnalysisResult.suggestions && policyAnalysisResult.suggestions.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>Suggested Improvements:</Typography>
                <List dense>
                  {policyAnalysisResult.suggestions.map((suggestion, index) => (
                    <ListItem key={index} sx={{ borderBottom: '1px dotted #eee' }}>
                      <ListItemText primary={suggestion} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        )}

        <Divider sx={{ my: 4 }} />

        {/* --- Document List Section --- */}
        {documentsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : documentsError ? (
          <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
            {documentsError}
          </Typography>
        ) : (
          <DocumentList documents={documents} />
        )}
      </Container>
    </div>
  );
}

export default App;