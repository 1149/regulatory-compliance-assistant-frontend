/**
 * Main Application Component
 * 
 * Enterprise Regulatory Intelligence Platform - A comprehensive AI-powered tool
 * for regulatory document analysis and compliance management. Features include:
 * - Document upload and management
 * - AI-powered policy analysis
 * - Regulatory compliance insights
 * - Document search and chat functionality
 */
import React, { useState } from 'react';
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
import Paper from '@mui/material/Paper';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Alert from '@mui/material/Alert';
import { marked } from 'marked';

import { usePolicyAnalysis } from './hooks/usePolicyAnalysis';
import LoadingSpinner from './components/common/LoadingSpinner';
import AnimatedBackground from './components/common/AnimatedBackground';
import Watermark from './components/common/Watermark';

function App() {
  const {
    userPolicyText,
    setUserPolicyText,
    policyAnalysisResult,
    policyAnalysisLoading,
    policyAnalysisError,
    loadingText,
    handlePolicyAnalysis,
    clearPolicyAnalysis,
  } = usePolicyAnalysis();

  const [refreshDocs, setRefreshDocs] = useState(false);

  const handleUploadSuccess = () => {
    setRefreshDocs((prev) => !prev);
  };

  return (
    <AnimatedBackground>
      <Watermark />
        <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          minHeight: '100vh',
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
        >        <Typography
          variant="h1"
          component="h1"          sx={{
            mt: 8,
            mb: 3,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: '"Inter", "Roboto", sans-serif',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 35%, #42a5f5 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
            textAlign: 'center',
            textShadow: '0 2px 8px rgba(25, 118, 210, 0.2)',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '3px',
              background: 'linear-gradient(90deg, #1565c0, #42a5f5)',
              borderRadius: '2px',
              opacity: 0.7,
            }
          }}
        >
          Enterprise Regulatory Intelligence Platform
        </Typography>
        <Typography 
          variant="h5" 
          component="h2"
          sx={{ 
            textAlign: 'center', 
            mb: 2,
            fontFamily: '"Inter", "Poppins", "Roboto", sans-serif',
            fontWeight: 600,
            color: '#37474f',
            fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
            letterSpacing: '0.01em',
            lineHeight: 1.4,
          }}
        >
          Advanced AI-Powered Regulatory Analysis & Compliance Intelligence
        </Typography>
        <Typography 
          variant="body1" 
          paragraph 
          sx={{ 
            textAlign: 'center', 
            mb: 5,
            color: '#546e7a',
            fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
            fontWeight: 400,
            lineHeight: 1.6,
            maxWidth: '700px',
            mx: 'auto',
            fontFamily: '"Inter", "Roboto", sans-serif',
          }}
        >
          Professional-grade AI assistant designed for regulatory compliance teams. Streamline document analysis, 
          extract critical insights, and accelerate compliance workflows with enterprise-level intelligence and precision.
        </Typography>        <Box
          sx={{
            mb: 4,
            mt: 4,
            width: '100%',
            maxWidth: 'none',
            mx: 0,
          }}
        >
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        </Box>
        
        <Divider sx={{ my: 4 }} />

        <Paper
          elevation={6}          sx={{
            mt: 6,
            p: { xs: 2, sm: 4 },
            background: 'rgba(244, 246, 248, 0.95)',
            backdropFilter: 'blur(15px)',
            borderRadius: 4,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.20)',
            border: '1px solid rgba(224, 227, 231, 0.5)',
            width: '100%',
            maxWidth: 'none',
            mx: 0,
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
          </Button>          {policyAnalysisLoading && (
            <LoadingSpinner 
              text={loadingText}
              sx={{ 
                mb: 2, 
                p: 2, 
                bgcolor: '#f3e5f5', 
                borderRadius: 2, 
                border: '1px solid #e1bee7'
              }}
            />
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
                </Button>                <Button
                  variant="outlined"
                  size="small"
                  color="secondary"
                  onClick={clearPolicyAnalysis}
                >
                  🔄 New Analysis
                </Button>
              </Box>
            </Box>
          )}        </Paper>
        
        <Divider sx={{ my: 4 }} />        <Divider sx={{ my: 4 }} />

        <DocumentLibrary refresh={refreshDocs} />
      </Container>
      </Box>
    </AnimatedBackground>
  );
}

export default App;