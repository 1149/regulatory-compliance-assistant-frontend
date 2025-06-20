import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import FileUpload from './components/FileUpload';
import DocumentLibrary from './components/DocumentLibrary';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Alert from '@mui/material/Alert';
import { marked } from 'marked';

function App() {
  // State for semantic search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [searchExecuted, setSearchExecuted] = useState(false); // NEW: Track if search was executed

  // NEW: State for Policy Analyzer
  const [userPolicyText, setUserPolicyText] = useState('');
  const [policyAnalysisResult, setPolicyAnalysisResult] = useState(null);
  const [policyAnalysisLoading, setPolicyAnalysisLoading] = useState(false);
  const [policyAnalysisError, setPolicyAnalysisError] = useState(null);
  const [loadingText, setLoadingText] = useState('🔍 Analyzing policy structure...');
  // State to trigger refresh of DocumentLibrary after upload
  const [refreshDocs, setRefreshDocs] = useState(false);

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
  };  // NEW: Handle Policy Analysis Submission with innovative loading
  const handlePolicyAnalysis = async () => {
    if (!userPolicyText.trim() || policyAnalysisLoading) {
      return;
    }

    setPolicyAnalysisLoading(true);
    setPolicyAnalysisError(null);
    setPolicyAnalysisResult(null);

    // Loading stages for innovative UI
    const loadingStages = [
      { text: "🔍 Analyzing policy structure...", duration: 1000 },
      { text: "🤖 AI is reviewing compliance requirements...", duration: 2000 },
      { text: "📋 Identifying gaps and recommendations...", duration: 1500 },
      { text: "✨ Finalizing your personalized report...", duration: 500 }
    ];

    let currentStage = 0;
    setLoadingText(loadingStages[0].text);

    // Simulate progressive loading stages
    const stageInterval = setInterval(() => {
      currentStage++;
      if (currentStage < loadingStages.length) {
        setLoadingText(loadingStages[currentStage].text);
      } else {
        clearInterval(stageInterval);
      }
    }, 1000);

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
      
      // Clear the interval when done
      clearInterval(stageInterval);
      
      setPolicyAnalysisResult(data);

    } catch (error) {
      clearInterval(stageInterval);
      setPolicyAnalysisError(`Error during policy analysis: ${error.message}`);
    } finally {
      setPolicyAnalysisLoading(false);
    }
  };

  // Callback to refresh documents after upload
  const handleUploadSuccess = () => {
    setRefreshDocs((prev) => !prev);
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
        <Box
          sx={{
            mb: 4,
            mt: 4,
            width: '100%',        // Fill the container horizontally
            maxWidth: 'none',     // Remove maxWidth restriction
            mx: 0,                // Remove horizontal auto margin
          }}
        >
          <FileUpload onUploadSuccess={handleUploadSuccess} />
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
            width: '100%',           // Make it fill the container horizontally
            maxWidth: 'none',        // Remove maxWidth restriction
            mx: 0,                   // Remove horizontal auto margin
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              letterSpacing: 1,
              mb: 3,
              textAlign: 'center',
              fontFamily: `'Montserrat', 'Segoe UI', 'Roboto', 'Arial', sans-serif`,
              textShadow: '0 2px 8px rgba(25,118,210,0.10)',
              borderBottom: '2px solid',
              borderColor: 'divider',
              pb: 1,
              background: 'transparent',
              fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
              textTransform: 'uppercase',
            }}
          >
            <SearchIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main', fontSize: 28 }} />
            Semantic Search
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              color: 'info.main',
              textAlign: 'center',
              mb: 3,
              fontStyle: 'italic',
              letterSpacing: 0.2,
            }}
          >
            Note: This project is a personal side project for learning and demonstration purposes only. Features and results are for demo use and not intended for production.
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
            width: '100%',           // Make it fill the container horizontally
            maxWidth: 'none',        // Remove maxWidth restriction
            mx: 0,                   // Remove horizontal auto margin
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
            endIcon={<AssignmentTurnedInIcon />}          >
            {policyAnalysisLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} sx={{ color: 'white' }} />
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                  {loadingText}
                </Typography>
              </Box>
            ) : (
              'Analyze Policy'
            )}
          </Button>
          
          {/* Loading Stage Indicator */}
          {policyAnalysisLoading && (
            <Box sx={{ 
              mb: 2, 
              p: 2, 
              bgcolor: '#f3e5f5', 
              borderRadius: 2, 
              border: '1px solid #e1bee7',
              textAlign: 'center'
            }}>
              <Typography variant="body2" sx={{ 
                color: '#7b1fa2', 
                fontWeight: 600,
                fontSize: '1rem',
                animation: 'pulse 1.5s ease-in-out infinite'
              }}>
                {loadingText}
              </Typography>
              <Typography variant="caption" sx={{ 
                color: '#9c27b0', 
                mt: 1, 
                display: 'block',
                fontStyle: 'italic'
              }}>
                🧠 Our AI is working hard to give you the best insights...
              </Typography>
            </Box>
          )}
          
          {policyAnalysisError && (
            <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
              {policyAnalysisError}
            </Typography>
          )}{policyAnalysisResult && (
            <Box
              sx={{
                mt: 2,
                p: 3,
                border: '1px solid #c8e6c9',
                borderRadius: 3,
                bgcolor: '#f1f8e9',
                boxShadow: '0 2px 8px 0 rgba(56, 142, 60, 0.1)',
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: '#388e3c', fontWeight: 600, mb: 2 }}>
                📋 Policy Analysis Complete
              </Typography>
              
              {/* Metadata Summary */}
              {policyAnalysisResult.metadata && (
                <Box sx={{ mb: 3, p: 2, bgcolor: '#fff', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                  <Typography variant="subtitle2" sx={{ color: '#1976d2', fontWeight: 600, mb: 1 }}>
                    Analysis Summary
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
                    <Typography variant="body2">
                      <strong>Overall Score:</strong> {policyAnalysisResult.metadata.overall_compliance_score}/10
                    </Typography>
                    <Typography variant="body2">
                      <strong>Word Count:</strong> {policyAnalysisResult.metadata.word_count?.toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Status:</strong> <span style={{ color: '#4caf50' }}>{policyAnalysisResult.status}</span>
                    </Typography>
                    <Typography variant="body2">
                      <strong>Analyzed:</strong> {new Date(policyAnalysisResult.metadata.analysis_timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              )}              {/* Main Analysis */}
              <Box sx={{ mb: 2, p: 3, bgcolor: '#fff', borderRadius: 2, border: '1px solid #e0e0e0' }}>                <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 600, mb: 3, fontSize: '1.5rem' }}>
                  📊 Policy Review & Recommendations
                </Typography><Box 
                  sx={{ 
                    '& .analysis-content': {
                      fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
                      lineHeight: 1.6,
                      fontSize: '0.95rem'
                    },
                    '& .analysis-content h2': { 
                      fontSize: '1.1rem', 
                      fontWeight: 600, 
                      color: '#1976d2', 
                      marginTop: '16px', 
                      marginBottom: '8px',
                      borderBottom: '2px solid #e3f2fd',
                      paddingBottom: '4px'
                    },
                    '& .analysis-content h3': { 
                      fontSize: '1rem', 
                      fontWeight: 600, 
                      color: '#388e3c', 
                      marginTop: '12px', 
                      marginBottom: '8px' 
                    },
                    '& .analysis-content p': { 
                      marginBottom: '12px',
                      lineHeight: 1.6
                    },
                    '& .analysis-content ul': { 
                      paddingLeft: '20px', 
                      marginBottom: '12px' 
                    },
                    '& .analysis-content ol': { 
                      paddingLeft: '20px', 
                      marginBottom: '12px' 
                    },
                    '& .analysis-content li': { 
                      marginBottom: '4px',
                      lineHeight: 1.5
                    },
                    '& .analysis-content strong': { 
                      fontWeight: 600, 
                      color: '#1565c0' 
                    }
                  }}
                >
                  <div 
                    className="analysis-content"
                    dangerouslySetInnerHTML={{ 
                      __html: marked.parse(policyAnalysisResult.analysis, {
                        breaks: true,
                        gfm: true
                      })
                    }}
                  />
                </Box>
              </Box>

              {/* Recommendations Summary */}
              {policyAnalysisResult.recommendations_summary && (
                <Box sx={{ p: 2, bgcolor: '#fff3e0', borderRadius: 2, border: '1px solid #ffcc02' }}>
                  <Typography variant="subtitle2" sx={{ color: '#f57c00', fontWeight: 600, mb: 1 }}>
                    🚀 Next Steps
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>High Priority:</strong> {policyAnalysisResult.recommendations_summary.high_priority}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Next Steps:</strong> {policyAnalysisResult.recommendations_summary.next_steps}
                  </Typography>
                </Box>
              )}

              {/* Action Buttons */}
              <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    const analysisText = `
POLICY ANALYSIS REPORT
Generated: ${new Date().toLocaleString()}

${policyAnalysisResult.analysis}

---
Analysis Summary:
- Overall Compliance Score: ${policyAnalysisResult.metadata?.overall_compliance_score}/10
- Word Count: ${policyAnalysisResult.metadata?.word_count}
- Status: ${policyAnalysisResult.status}
                    `.trim();
                    navigator.clipboard.writeText(analysisText);
                    alert('Analysis copied to clipboard!');
                  }}
                >
                  📋 Copy Analysis
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="secondary"
                  onClick={() => {
                    setPolicyAnalysisResult(null);
                    setUserPolicyText('');
                  }}
                >
                  🔄 New Analysis
                </Button>
              </Box>
            </Box>
          )}
        </Paper>        <Divider sx={{ my: 4 }} />

        {/* --- Document List Section --- */}
        <DocumentLibrary refresh={refreshDocs} /></Container>
      
      {/* CSS Animations for loading */}
      <style>
        {`
          @keyframes pulse {
            0% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.7;
              transform: scale(1.02);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>
      
      {/* Add Google Fonts link for Dancing Script */}
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap"
        rel="stylesheet"
      />
    </Box>
  );
}

export default App;