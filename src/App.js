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

function App() {  // NEW: State for Policy Analyzer
  const [userPolicyText, setUserPolicyText] = useState('');
  const [policyAnalysisResult, setPolicyAnalysisResult] = useState(null);
  const [policyAnalysisLoading, setPolicyAnalysisLoading] = useState(false);
  const [policyAnalysisError, setPolicyAnalysisError] = useState(null);
  const [loadingText, setLoadingText] = useState('🔍 Analyzing policy structure...');
  // State to trigger refresh of DocumentLibrary after upload
  const [refreshDocs, setRefreshDocs] = useState(false);
  // NEW: Handle Policy Analysis Submission with innovative loading
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
        position: 'relative',
        overflow: 'hidden',
      }}
    >      {/* Video Background */}
      <Box
        component="video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -2,
          opacity: 0.6, // Adjust opacity for better text readability
          filter: 'brightness(0.8) contrast(1.1)', // Enhance video contrast
        }}
        onError={(e) => {
          // Fallback if video fails to load
          e.target.style.display = 'none';
        }}
      >
        <source src="/background-animation.mp4" type="video/mp4" />
        {/* Fallback background if video doesn't load */}
      </Box>
      
      {/* Fallback Background (shown if video fails) */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          zIndex: -3,
        }}
      />
      
      {/* Dark Overlay for Better Text Contrast */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.3) 0%, rgba(45, 45, 45, 0.2) 50%, rgba(30, 30, 30, 0.4) 100%)',
          zIndex: -1,
        }}      />
        {/* Watermark Logo */}
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 10, sm: 20 }, // Responsive positioning
          right: { xs: 10, sm: 20 },
          zIndex: 1000,
          opacity: { xs: 0.1, sm: 0.15 }, // Less opacity on mobile
          transition: 'all 0.3s ease',
          '&:hover': {
            opacity: 0.4,
            transform: 'scale(1.02)',
          },
        }}
      >        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(100, 181, 246, 0.05) 100%)',
            backdropFilter: 'blur(15px)',
            borderRadius: 4,
            p: { xs: 1.5, sm: 2.5 },
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            }
          }}>{/* Custom SVG Logo */}
          <Box
            sx={{
              width: { xs: 50, sm: 60 },
              height: { xs: 50, sm: 60 },
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1) rotate(5deg)',
              }
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Rotating Outer Ring */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#watermarkOuterGradient)"
                strokeWidth="2"
                strokeDasharray="8 4"
                opacity="0.7"
              >
                <animateTransform
                  attributeName="transform"
                  attributeType="XML"
                  type="rotate"
                  from="0 50 50"
                  to="360 50 50"
                  dur="25s"
                  repeatCount="indefinite"
                />
              </circle>
              
              {/* Static Outer Ring */}
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#watermarkStaticRing)"
                strokeWidth="1"
                opacity="0.6"
              />
              
              {/* Inner Background Circle */}
              <circle
                cx="50"
                cy="50"
                r="35"
                fill="url(#watermarkBackgroundGradient)"
                stroke="url(#watermarkBorderGradient)"
                strokeWidth="1"
                opacity="0.8"
              />
              
              {/* Compass Points */}
              <g opacity="0.9">
                {/* North Point */}
                <polygon
                  points="50,12 53,30 50,35 47,30"
                  fill="url(#watermarkPointGradient)"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="0.5"
                />
                {/* South Point */}
                <polygon
                  points="50,88 53,70 50,65 47,70"
                  fill="url(#watermarkPointGradient)"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="0.5"
                />
                {/* East Point */}
                <polygon
                  points="88,50 70,47 65,50 70,53"
                  fill="url(#watermarkPointGradient)"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="0.5"
                />
                {/* West Point */}
                <polygon
                  points="12,50 30,47 35,50 30,53"
                  fill="url(#watermarkPointGradient)"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="0.5"
                />
              </g>
              
              {/* Center Circle with Checkmark */}
              <circle
                cx="50"
                cy="50"
                r="18"
                fill="url(#watermarkCenterGradient)"
                stroke="rgba(255,255,255,0.8)"
                strokeWidth="2"
                opacity="0.9"
              />
              
              {/* Checkmark */}
              <path
                d="M43 50 L47 54 L57 44"
                fill="none"
                stroke="rgba(255,255,255,0.9)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Subtle inner glow */}
              <circle
                cx="50"
                cy="50"
                r="15"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
                opacity="0.5"
              />
              
              {/* Gradient Definitions for Watermark */}
              <defs>
                <linearGradient id="watermarkOuterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                  <stop offset="50%" stopColor="rgba(100,181,246,0.5)" />
                  <stop offset="100%" stopColor="rgba(25,118,210,0.3)" />
                </linearGradient>
                
                <linearGradient id="watermarkStaticRing" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                  <stop offset="100%" stopColor="rgba(227,242,253,0.4)" />
                </linearGradient>
                
                <radialGradient id="watermarkBackgroundGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
                  <stop offset="70%" stopColor="rgba(100,181,246,0.15)" />
                  <stop offset="100%" stopColor="rgba(25,118,210,0.1)" />
                </radialGradient>
                
                <linearGradient id="watermarkBorderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                  <stop offset="100%" stopColor="rgba(100,181,246,0.3)" />
                </linearGradient>
                
                <linearGradient id="watermarkPointGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                  <stop offset="50%" stopColor="rgba(227,242,253,0.6)" />
                  <stop offset="100%" stopColor="rgba(187,222,251,0.4)" />
                </linearGradient>
                
                <radialGradient id="watermarkCenterGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(102,187,106,0.8)" />
                  <stop offset="100%" stopColor="rgba(46,125,50,0.6)" />
                </radialGradient>
              </defs>
            </svg>
          </Box>
          {/* Logo Text */}
          <Box sx={{ textAlign: 'center' }}>            <Typography
              variant="caption"
              sx={{
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.7rem',
                letterSpacing: '1px',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                lineHeight: 1.2,
              }}
            >
              COMPLIANCE
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.7rem',
                letterSpacing: '1px',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                lineHeight: 1.2,
                display: 'block',
              }}
            >
              NAVIGATOR
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#64b5f6',
                fontWeight: 600,
                fontSize: '0.65rem',
                letterSpacing: '0.8px',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                lineHeight: 1.2,
                display: 'block',
                mt: 0.5,
                textTransform: 'uppercase',
              }}
            >
              RegGuide Platform
            </Typography>
          </Box>
        </Box>
      </Box>
      
      {/* Content Layer */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
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
        </Box>        <Divider sx={{ my: 4 }} />

        {/* --- Policy Analysis Section (Enhanced Professional UI) --- */}        <Paper
          elevation={6}
          sx={{
            mt: 6,
            p: { xs: 2, sm: 4 },
            background: 'rgba(244, 246, 248, 0.95)', // Semi-transparent background
            backdropFilter: 'blur(15px)', // Glass effect
            borderRadius: 4,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.20)',
            border: '1px solid rgba(224, 227, 231, 0.5)',
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
        rel="stylesheet"      />
      </Box>
    </Box>
  );
}

export default App;