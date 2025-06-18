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
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Alert from '@mui/material/Alert';

function App() {
  // State for semantic search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [searchExecuted, setSearchExecuted] = useState(false); // NEW: Track if search was executed

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
    setSearchExecuted(false); // Reset executed state on new search
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
      setSearchExecuted(true); // Mark search as executed
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
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e9ecef 0%, #f5f7fa 100%)',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <Navbar />
      <Container
        component="main"
        maxWidth="md"
        sx={{
          mt: 0,
          mb: 4,
          p: 3,
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: 3,
          boxShadow: 4,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            mt: 8,
            mb: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: `'Dancing Script', 'Brush Script MT', cursive, sans-serif`,
            fontWeight: 700,
            letterSpacing: 1,
            color: '#23272f',
            fontSize: { xs: '2.2rem', sm: '3rem', md: '3.5rem' },
            textAlign: 'center',
          }}
        >
          Regulatory Compliance Assistant
        </Typography>
        <Typography variant="body1" paragraph sx={{ textAlign: 'center', mb: 5 }}>
          Upload documents or search existing ones to find relevant information and insights.
        </Typography>

        {/* --- File Upload Section --- */}
        <Box sx={{ mb: 4, mt: 4 }}>
          <FileUpload onUploadSuccess={fetchDocuments} />
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* --- Semantic Search Section (professional look) --- */}
        <Paper
          elevation={6}
          sx={{
            p: { xs: 2, sm: 4 },
            mb: 6,
            background: '#f4f6f8',
            borderRadius: 4,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
            border: '1px solid #e0e3e7',
            maxWidth: 700,
            mx: 'auto',
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: '#1976d2',
              letterSpacing: 1,
              mb: 3,
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SearchIcon sx={{ mr: 1, verticalAlign: 'middle', fontSize: 30, color: '#1976d2' }} />
            Semantic Search
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mb: 3,
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <TextField
              label="Search documents by meaning..."
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 2,
                  background: '#fff',
                  fontSize: '1.08rem',
                  fontFamily: 'inherit',
                  boxShadow: '0 1px 4px 0 rgba(25, 118, 210, 0.07)',
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={searchLoading}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                fontSize: '1.08rem',
                background: '#1976d2',
                boxShadow: '0 2px 8px 0 rgba(25, 118, 210, 0.10)',
                '&:hover': {
                  background: '#115293',
                },
                height: '56px',
              }}
              endIcon={<SearchIcon />}
            >
              {searchLoading ? <CircularProgress size={24} /> : 'Search'}
            </Button>
          </Box>

          {searchError && (
            <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
              {searchError}
            </Typography>
          )}

          <Fade in={searchExecuted && !searchLoading && searchResults.length === 0}>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
              No results found for your query.
            </Typography>
          </Fade>

          <Fade in={searchResults.length > 0}>
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1, color: '#1976d2', fontWeight: 600 }}>
                Results
              </Typography>
              {searchResults.map((doc) => (
                <Paper key={doc.id} sx={{ p: 2, mb: 2, background: '#e3f2fd', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: '#1976d2', fontWeight: 600 }}>
                    {doc.filename} ({doc.subject || 'Uncategorized'})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status: {doc.status} | Uploaded: {new Date(doc.upload_date).toLocaleString()}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Fade>
        </Paper>

        <Divider sx={{ my: 4 }} />

        {/* --- Policy Analysis Section (Enhanced Professional UI) --- */}
        <Paper
          elevation={6}
          sx={{
            mt: 6,
            p: { xs: 2, sm: 4 },
            background: '#f4f6f8',
            borderRadius: 4,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
            border: '1px solid #e0e3e7',
            maxWidth: 700,
            mx: 'auto',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AssignmentTurnedInIcon sx={{ color: '#388e3c', fontSize: 32, mr: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#388e3c', letterSpacing: 1 }}>
              Policy Compliance Analyzer
            </Typography>
          </Box>
          <Alert
            severity="info"
            sx={{
              mb: 2,
              fontSize: '0.98rem',
              background: '#e8f5e9',
              color: '#2e7d32',
              borderRadius: 2,
              alignItems: 'center'
            }}
            icon={<InfoOutlinedIcon fontSize="inherit" />}
          >
            Paste your policy text below to analyze compliance and receive AI-powered suggestions for improvement.
          </Alert>
          <TextField
            label="Paste your policy text here for analysis..."
            variant="outlined"
            multiline
            rows={7}
            fullWidth
            value={userPolicyText}
            onChange={(e) => setUserPolicyText(e.target.value)}
            sx={{
              background: '#fff',
              borderRadius: 2,
              mb: 2,
              boxShadow: '0 1px 4px 0 rgba(56, 142, 60, 0.07)',
            }}
          />
          <Button
            variant="contained"
            onClick={handlePolicyAnalysis}
            disabled={policyAnalysisLoading}
            sx={{
              width: '100%',
              py: 1.5,
              fontWeight: 600,
              fontSize: '1.08rem',
              borderRadius: 2,
              background: 'linear-gradient(90deg, #388e3c 0%, #1976d2 100%)',
              boxShadow: '0 2px 8px 0 rgba(56,142,60,0.10)',
              '&:hover': {
                background: 'linear-gradient(90deg, #1976d2 0%, #388e3c 100%)',
              },
              mb: 2,
            }}
            endIcon={<AssignmentTurnedInIcon />}
          >
            {policyAnalysisLoading ? <CircularProgress size={24} /> : 'Analyze Policy'}
          </Button>
          {policyAnalysisError && (
            <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
              {policyAnalysisError}
            </Typography>
          )}
          {policyAnalysisResult && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                border: '1px solid #c8e6c9',
                borderRadius: 2,
                bgcolor: '#f1f8e9',
                boxShadow: '0 1px 4px 0 rgba(56, 142, 60, 0.07)',
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: '#388e3c', fontWeight: 600 }}>
                Compliance Analysis Status
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>
                <strong>Status:</strong> {policyAnalysisResult.status || 'N/A'}<br />
                <strong>Message:</strong> {policyAnalysisResult.message || 'No message'}<br />
                {policyAnalysisResult.received_text_length && (
                  <span><strong>Text Length:</strong> {policyAnalysisResult.received_text_length} characters</span>
                )}
              </Typography>
              {policyAnalysisResult.suggestions && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ color: '#1976d2', fontWeight: 600 }}>
                    AI-Generated Suggestions
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {policyAnalysisResult.suggestions}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Paper>

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
      {/* Add Google Fonts link for Dancing Script */}
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap"
        rel="stylesheet"
      />
    </Box>
  );
}

export default App;