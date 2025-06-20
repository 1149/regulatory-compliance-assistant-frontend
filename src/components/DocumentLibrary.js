import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tooltip,
  Button,
  CircularProgress,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import StorageIcon from '@mui/icons-material/Storage';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import FolderIcon from '@mui/icons-material/Folder';

const BACKEND_BASE_URL = 'http://127.0.0.1:8000';

// Helper to format date as "Month Day, Year, HH:MM AM/PM PST"
function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Los_Angeles',
    timeZoneName: 'short',
  });
}

function DocumentLibrary({ refresh }) {
  const [documents, setDocuments] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState({});
  const [entitiesLoading, setEntitiesLoading] = useState({});
  // Chatbot states
  const [chatOpen, setChatOpen] = useState(false);
  const [currentDocId, setCurrentDocId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  // Document viewer states
  const [documentViewerOpen, setDocumentViewerOpen] = useState(false);
  const [documentContent, setDocumentContent] = useState('');
  const [documentViewerLoading, setDocumentViewerLoading] = useState(false);
  const [currentDocumentName, setCurrentDocumentName] = useState('');  // Summary dialog states
  const [summaryDialogOpen, setSummaryDialogOpen] = useState(false);
  const [summaryContent, setSummaryContent] = useState('');
  const [summaryType, setSummaryType] = useState(''); // 'cloud' or 'local'
  const [summaryDocumentName, setSummaryDocumentName] = useState('');
  // Entities dialog states
  const [entitiesDialogOpen, setEntitiesDialogOpen] = useState(false);
  const [entitiesContent, setEntitiesContent] = useState([]);
  const [entitiesDocumentName, setEntitiesDocumentName] = useState('');  // Helper function to group documents by subject
  const groupDocumentsBySubject = (documents) => {
    const grouped = {};
    // Add safety check for documents array and filter out null/undefined items
    if (!documents || !Array.isArray(documents)) {
      return grouped;
    }
    
    documents.filter(doc => doc && doc.id).forEach(doc => {
      const subject = doc.subject || 'Uncategorized';
      if (!grouped[subject]) {
        grouped[subject] = [];
      }
      grouped[subject].push(doc);
    });
    
    // Sort documents within each subject by upload_date in descending order (latest first)
    Object.keys(grouped).forEach(subject => {
      grouped[subject].sort((a, b) => {
        const dateA = new Date(a.upload_date);
        const dateB = new Date(b.upload_date);
        return dateB - dateA; // Descending order (latest first)
      });
    });
    
    return grouped;
  };

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/documents/`);
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line
  }, [refresh]);

  const handleExpandClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${BACKEND_BASE_URL}/api/documents/${id}/`, { method: 'DELETE' });
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document. Please try again.');
    }
  };
  const handleSummarizeCloud = async (docId) => {
    setSummaryLoading(prev => ({ ...prev, [docId]: true }));
    try {
      // First get the document text
      const textResponse = await fetch(`${BACKEND_BASE_URL}/api/documents/${docId}/text`);
      if (!textResponse.ok) {
        throw new Error('Failed to fetch document text');
      }
      const documentText = await textResponse.text();

      // Then summarize it
      const summaryResponse = await fetch(`${BACKEND_BASE_URL}/api/summarize-text/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: documentText }),
      });

      if (!summaryResponse.ok) {
        throw new Error('Failed to generate summary');
      }

      const summaryData = await summaryResponse.json();
      
      // Show summary in dialog instead of alert
      const document = documents.find(doc => doc.id === docId);
      setSummaryDocumentName(document?.filename || `Document ${docId}`);
      setSummaryContent(summaryData.summary);
      setSummaryType('cloud');
      setSummaryDialogOpen(true);
    } catch (error) {
      console.error('Error summarizing document:', error);
      alert('Failed to summarize document. Please try again.');
    } finally {
      setSummaryLoading(prev => ({ ...prev, [docId]: false }));
    }
  };
  const handleSummarizeLocal = async (docId) => {
    setSummaryLoading(prev => ({ ...prev, [docId + '_local']: true }));
    try {
      // First get the document text
      const textResponse = await fetch(`${BACKEND_BASE_URL}/api/documents/${docId}/text`);
      if (!textResponse.ok) {
        throw new Error('Failed to fetch document text');
      }
      const documentText = await textResponse.text();

      // Then summarize it using local endpoint
      const summaryResponse = await fetch(`${BACKEND_BASE_URL}/api/summarize-text-local/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: documentText }),
      });

      if (!summaryResponse.ok) {
        throw new Error('Failed to generate local summary');
      }

      const summaryData = await summaryResponse.json();
      
      // Show summary in dialog instead of alert
      const document = documents.find(doc => doc.id === docId);
      setSummaryDocumentName(document?.filename || `Document ${docId}`);
      setSummaryContent(summaryData.summary);
      setSummaryType('local');
      setSummaryDialogOpen(true);
    } catch (error) {
      console.error('Error with local summarization:', error);
      alert('Failed to summarize document locally. Make sure Ollama is running.');
    } finally {
      setSummaryLoading(prev => ({ ...prev, [docId + '_local']: false }));
    }
  };
  const handleViewEntities = async (docId) => {
    setEntitiesLoading(prev => ({ ...prev, [docId]: true }));
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/documents/${docId}/entities`);
      if (!response.ok) {
        throw new Error('Failed to fetch entities');
      }
      const entities = await response.json();
      
      // Show entities in dialog instead of alert
      const document = documents.find(doc => doc.id === docId);
      setEntitiesDocumentName(document?.filename || `Document ${docId}`);
      setEntitiesContent(entities);
      setEntitiesDialogOpen(true);
    } catch (error) {
      console.error('Error fetching entities:', error);
      alert('Failed to fetch entities. Please try again.');
    } finally {
      setEntitiesLoading(prev => ({ ...prev, [docId]: false }));
    }
  };const handleViewDocument = async (docId) => {
    const document = documents.find(doc => doc.id === docId);
    setCurrentDocumentName(document?.filename || `Document ${docId}`);
    setDocumentViewerOpen(true);
    setDocumentViewerLoading(true);
    
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/documents/${docId}/text`);
      if (!response.ok) {
        throw new Error('Failed to fetch document text');
      }
      const documentText = await response.text();
      setDocumentContent(documentText);
    } catch (error) {
      console.error('Error viewing document:', error);
      setDocumentContent('Error loading document content. Please try again.');
    } finally {
      setDocumentViewerLoading(false);
    }
  };

  const handleCloseDocumentViewer = () => {
    setDocumentViewerOpen(false);
    setDocumentContent('');
    setCurrentDocumentName('');
  };
  const handleCloseSummaryDialog = () => {
    setSummaryDialogOpen(false);
    setSummaryContent('');
    setSummaryType('');
    setSummaryDocumentName('');
  };

  const handleCloseEntitiesDialog = () => {
    setEntitiesDialogOpen(false);
    setEntitiesContent([]);
    setEntitiesDocumentName('');
  };

  // NEW: Chatbot functions
  const handleOpenChat = (docId) => {
    setCurrentDocId(docId);
    setChatOpen(true);
    setChatMessages([
      {
        type: 'assistant',
        message: 'Hello! I can help you ask questions about this document. What would you like to know?',
        timestamp: new Date()
      }
    ]);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
    setCurrentDocId(null);
    setChatMessages([]);
    setChatInput('');
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = {
      type: 'user',
      message: chatInput.trim(),
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/document/${currentDocId}/qa/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userMessage.message }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from chatbot');
      }

      const data = await response.json();
      
      const assistantMessage = {
        type: 'assistant',
        message: data.answer || 'I apologize, but I could not generate a response.',
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
      const errorMessage = {
        type: 'assistant',
        message: 'Sorry, I encountered an error while processing your question. Please try again.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setChatLoading(false);
    }
  };
  return (
    <Box sx={{ width: '100%', mx: 'auto', mt: 4 }}>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          background: '#f4f6f8',
          borderRadius: 4,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
          border: '1px solid #e0e3e7',
          width: '100%',
          minHeight: 350,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            mb: 2,
            color: '#1976d2',
            fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' }, // Decreased font size
            letterSpacing: 1,
          }}
        >
          <DescriptionIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#388e3c', fontSize: 28 }} />
          Uploaded Documents
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress size={40} />
          </Box>
        ) : (          <>
            {!documents || documents.length === 0 ? (
              <Typography variant="h6" color="text.secondary" align="center" sx={{ my: 2, fontWeight: 400 }}>
                No documents uploaded yet.
              </Typography>
            ) : (
              (() => {
                const groupedDocuments = groupDocumentsBySubject(documents);
                const subjects = Object.keys(groupedDocuments).sort();
                
                // Additional safety check for subjects
                if (subjects.length === 0) {
                  return (
                    <Typography variant="h6" color="text.secondary" align="center" sx={{ my: 2, fontWeight: 400 }}>
                      No valid documents found.
                    </Typography>
                  );
                }
                  return subjects.map((subject) => {
                  // Safety check for grouped documents
                  const docsInSubject = groupedDocuments[subject] || [];
                  if (docsInSubject.length === 0) return null;
                  
                  return (
                    <Accordion 
                      key={subject}
                      defaultExpanded
                      sx={{ 
                        mb: 2, 
                        borderRadius: 3,
                        boxShadow: '0 2px 8px 0 rgba(25, 118, 210, 0.10)',
                        '&:before': { display: 'none' },
                        background: '#fff'
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                          background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                          color: 'white',
                          borderRadius: '12px 12px 0 0',
                          minHeight: 64,
                          cursor: 'pointer',
                          '& .MuiAccordionSummary-content': {
                            alignItems: 'center',
                            margin: '12px 0',
                            cursor: 'pointer'
                          },
                          '& .MuiAccordionSummary-expandIconWrapper': {
                            color: 'white',
                            cursor: 'pointer'
                          },
                          '&:hover': {
                            background: 'linear-gradient(90deg, #1565c0 0%, #1e88e5 100%)',
                            transform: 'scale(1.01)',
                            transition: 'all 0.2s ease-in-out'
                          },
                          '&.Mui-expanded': {
                            minHeight: 64,
                            '& .MuiAccordionSummary-content': {
                              margin: '12px 0'
                            }
                          }
                        }}
                      >
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1, 
                          width: '100%',
                          cursor: 'pointer',
                          userSelect: 'none'
                        }}>
                          <FolderIcon sx={{ fontSize: 24 }} />
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 700,
                              fontSize: '1.2rem'
                            }}
                          >
                            {subject}
                          </Typography>
                          <Chip 
                            label={`${docsInSubject.length} document${docsInSubject.length !== 1 ? 's' : ''}`}
                            size="small"
                            sx={{ 
                              ml: 1,
                              background: 'rgba(255, 255, 255, 0.2)',
                              color: 'white',
                              fontWeight: 600
                            }}
                          />
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 0 }}>
                        <List sx={{ width: '100%' }}>
                          {docsInSubject.filter(doc => doc && doc.id).map((doc) => (
                            <React.Fragment key={doc.id}>
                              <ListItem
                                sx={{
                                  background: '#fafafa',
                                  borderRadius: 0,
                                  mb: 0,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  fontSize: '1.15rem',
                                  borderBottom: '1px solid #e0e0e0',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease-in-out',
                                  '&:hover': {
                                    background: '#e3f2fd',
                                    transform: 'translateX(4px)',
                                    borderLeft: '4px solid #1976d2'
                                  }
                                }}
                                onClick={() => handleExpandClick(doc.id)}
                                secondaryAction={
                                  <Tooltip title={expandedId === doc.id ? 'Hide Options' : 'Show Options'}>
                                    <IconButton
                                      edge="end"
                                      onClick={(e) => {
                                        e.stopPropagation(); // Prevent double-triggering
                                        handleExpandClick(doc.id);
                                      }}
                                      aria-label="more"
                                      size="large"
                                      sx={{ 
                                        fontSize: 28,
                                        cursor: 'pointer'
                                      }}
                                    >
                                      {expandedId === doc.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </IconButton>
                                  </Tooltip>
                                }
                              >
                                <ListItemText
                                  sx={{
                                    cursor: 'pointer',
                                    userSelect: 'none'
                                  }}
                                  primary={
                                    <Typography sx={{ 
                                      fontWeight: 700, 
                                      color: '#1976d2', 
                                      fontSize: '1.18rem',
                                      cursor: 'pointer',
                                      userSelect: 'none'
                                    }}>
                                      {doc.filename}
                                    </Typography>
                                  }
                                  secondary={
                                    <Typography variant="body1" color="text.secondary" sx={{ 
                                      fontSize: '1.05rem',
                                      cursor: 'pointer',
                                      userSelect: 'none'
                                    }}>
                                      Status: {doc.status} | Uploaded: {formatDateTime(doc.upload_date)}
                                    </Typography>
                                  }
                                />
                              </ListItem>
                              <Collapse in={expandedId === doc.id} timeout="auto" unmountOnExit>
                                <Box
                                  sx={{
                                    px: 3,
                                    py: 3,
                                    background: '#e3f2fd',
                                    borderRadius: 0,
                                    mb: 0,
                                    animation: 'fadeIn 0.3s',
                                    width: '100%',
                                  }}
                                >
                                  {/* Document Information Card */}
                                  <Box sx={{ mb: 3, p: 2, background: '#fff', borderRadius: 2, boxShadow: 1 }}>
                                    <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600, mb: 1, fontSize: '1.1rem' }}>
                                      📄 Document Details
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#333', lineHeight: 1.6 }}>
                                      <strong>Upload Date:</strong> {formatDateTime(doc.upload_date)}<br />
                                      <strong>Status:</strong> <span style={{ color: doc.status === 'processed_text' ? '#4caf50' : '#ff9800' }}>{doc.status}</span><br />
                                      <strong>Subject:</strong> <Chip label={doc.subject || 'Uncategorized'} size="small" sx={{ ml: 1 }} /><br />
                                      <strong>Document ID:</strong> {doc.id}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#666', mt: 1, display: 'block', fontStyle: 'italic' }}>
                                      💡 Times shown in Pacific Time (PST/PDT)
                                    </Typography>
                                  </Box>

                                  {/* Action Buttons - Clean Grid Layout */}
                                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
                                    {/* View & Analysis Section */}
                                    <Box>
                                      <Typography variant="subtitle2" sx={{ color: '#1976d2', fontWeight: 600, mb: 1.5, fontSize: '0.9rem' }}>
                                        🔍 VIEW & ANALYZE
                                      </Typography>
                                      <Stack spacing={1.5}>
                                        <Button
                                          variant="outlined"
                                          color="info"
                                          startIcon={<VisibilityIcon />}
                                          onClick={() => handleViewDocument(doc.id)}
                                          size="small"
                                          sx={{ 
                                            justifyContent: 'flex-start',
                                            '&:hover': { backgroundColor: '#e3f2fd' }
                                          }}
                                        >
                                          View Full Text
                                        </Button>
                                        <Button
                                          variant="outlined"
                                          color="warning"
                                          startIcon={<ChatIcon />}
                                          onClick={() => handleOpenChat(doc.id)}
                                          size="small"
                                          sx={{ 
                                            justifyContent: 'flex-start',
                                            '&:hover': { backgroundColor: '#fff3e0' }
                                          }}
                                        >
                                          Ask Questions
                                        </Button>
                                        <Button
                                          variant="outlined"
                                          color="success"
                                          startIcon={<ListAltIcon />}
                                          onClick={() => handleViewEntities(doc.id)}
                                          disabled={entitiesLoading[doc.id]}
                                          size="small"
                                          sx={{ 
                                            justifyContent: 'flex-start',
                                            '&:hover': { backgroundColor: '#e8f5e9' }
                                          }}
                                        >
                                          {entitiesLoading[doc.id] ? 'Loading...' : 'Extract Entities'}
                                        </Button>
                                      </Stack>
                                    </Box>

                                    {/* AI Summary Section */}
                                    <Box>
                                      <Typography variant="subtitle2" sx={{ color: '#1976d2', fontWeight: 600, mb: 1.5, fontSize: '0.9rem' }}>
                                        🤖 AI SUMMARY
                                      </Typography>
                                      <Stack spacing={1.5}>
                                        <Button
                                          variant="outlined"
                                          color="primary"
                                          startIcon={<CloudUploadIcon />}
                                          onClick={() => handleSummarizeCloud(doc.id)}
                                          disabled={summaryLoading[doc.id]}
                                          size="small"
                                          sx={{ 
                                            justifyContent: 'flex-start',
                                            '&:hover': { backgroundColor: '#e3f2fd' }
                                          }}
                                        >
                                          {summaryLoading[doc.id] ? 'Summarizing...' : 'Cloud AI'}
                                        </Button>
                                        <Button
                                          variant="outlined"
                                          color="secondary"
                                          startIcon={<StorageIcon />}
                                          onClick={() => handleSummarizeLocal(doc.id)}
                                          disabled={summaryLoading[doc.id + '_local']}
                                          size="small"
                                          sx={{ 
                                            justifyContent: 'flex-start',
                                            '&:hover': { backgroundColor: '#fce4ec' }
                                          }}
                                        >
                                          {summaryLoading[doc.id + '_local'] ? 'Summarizing...' : 'Local AI'}
                                        </Button>
                                      </Stack>
                                    </Box>
                                  </Box>

                                  {/* Delete Button - Separate and Less Prominent */}
                                  <Divider sx={{ my: 2 }} />
                                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                      variant="text"
                                      color="error"
                                      startIcon={<DeleteIcon />}
                                      onClick={() => handleDelete(doc.id)}
                                      size="small"
                                      sx={{ 
                                        px: 2,
                                        fontSize: '0.85rem',
                                        '&:hover': { backgroundColor: '#ffebee' }
                                      }}
                                    >
                                      Delete Document
                                    </Button>
                                  </Box>
                                </Box>
                              </Collapse>
                            </React.Fragment>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  );
                }).filter(Boolean); // Filter out any null results
              })()
            )}
          </>
        )}
      </Paper>

      {/* Chat Dialog */}
      <Dialog 
        open={chatOpen} 
        onClose={handleCloseChat}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            height: '80vh',
            maxHeight: '600px',
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ChatIcon sx={{ mr: 1 }} />
            <Typography variant="h6">Document Q&A Assistant</Typography>
          </Box>
          <IconButton onClick={handleCloseChat} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', p: 0 }}>
          {/* Chat Messages */}
          <Box sx={{ 
            flex: 1, 
            overflow: 'auto', 
            p: 2,
            background: '#f5f5f5'
          }}>
            {chatMessages.map((msg, index) => (
              <Box key={index} sx={{ 
                mb: 2,
                display: 'flex',
                justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <Paper sx={{
                  p: 2,
                  maxWidth: '70%',
                  background: msg.type === 'user' ? '#1976d2' : '#fff',
                  color: msg.type === 'user' ? 'white' : 'black',
                  borderRadius: msg.type === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px'
                }}>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {msg.message}
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    opacity: 0.7,
                    display: 'block',
                    mt: 0.5,
                    fontSize: '0.7rem'
                  }}>
                    {msg.timestamp.toLocaleTimeString()}
                  </Typography>
                </Paper>
              </Box>
            ))}
            
            {chatLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                <Paper sx={{ p: 2, background: '#fff', borderRadius: '18px 18px 18px 4px' }}>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  <Typography variant="body2" component="span">AI is thinking...</Typography>
                </Paper>
              </Box>
            )}
          </Box>

          {/* Chat Input */}
          <Box sx={{ 
            p: 2, 
            borderTop: '1px solid #e0e0e0',
            background: '#fff'
          }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Chip 
                label="💡 Try: What are the main compliance requirements?" 
                size="small" 
                variant="outlined"
                onClick={() => setChatInput("What are the main compliance requirements?")}
                sx={{ cursor: 'pointer' }}
              />
              <Chip 
                label="📋 Try: Summarize this document" 
                size="small" 
                variant="outlined"
                onClick={() => setChatInput("Can you summarize this document?")}
                sx={{ cursor: 'pointer' }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Ask a question about this document..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                multiline
                maxRows={3}
                disabled={chatLoading}
              />
              <Button
                variant="contained"
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || chatLoading}
                sx={{ minWidth: '60px' }}
              >
                <SendIcon />
              </Button>
            </Box>
          </Box>        </DialogContent>
      </Dialog>

      {/* Document Viewer Dialog */}
      <Dialog 
        open={documentViewerOpen} 
        onClose={handleCloseDocumentViewer}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            height: '90vh',
            maxHeight: '800px',
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'linear-gradient(90deg, #4caf50 0%, #66bb6a 100%)',
          color: 'white'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <VisibilityIcon sx={{ mr: 1 }} />
            <Typography variant="h6">📄 {currentDocumentName}</Typography>
          </Box>
          <IconButton onClick={handleCloseDocumentViewer} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
          {documentViewerLoading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              height: '100%',
              flexDirection: 'column',
              gap: 2
            }}>
              <CircularProgress size={40} />
              <Typography variant="body1" color="text.secondary">
                Loading document content...
              </Typography>
            </Box>
          ) : (
            <Box sx={{ 
              p: 4,
              height: '100%',
              overflow: 'auto',
              background: '#fafafa'
            }}>
              <Paper sx={{ 
                p: 4,
                background: '#fff',
                borderRadius: 2,
                boxShadow: 1,
                minHeight: '100%'
              }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.8,
                    fontSize: '1rem',
                    fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
                    color: '#333'
                  }}
                >
                  {documentContent}
                </Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 2, background: '#f5f5f5' }}>
          <Button onClick={handleCloseDocumentViewer} variant="outlined">
            Close
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              navigator.clipboard.writeText(documentContent);
              alert('Document content copied to clipboard!');
            }}
            disabled={!documentContent || documentViewerLoading}
          >
            📋 Copy Content
          </Button>        </DialogActions>
      </Dialog>

      {/* Summary Dialog */}
      <Dialog 
        open={summaryDialogOpen} 
        onClose={handleCloseSummaryDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            height: '80vh',
            maxHeight: '600px',
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: summaryType === 'cloud' 
            ? 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)' 
            : 'linear-gradient(90deg, #9c27b0 0%, #e91e63 100%)',
          color: 'white'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {summaryType === 'cloud' ? (
              <CloudUploadIcon sx={{ mr: 1 }} />
            ) : (
              <StorageIcon sx={{ mr: 1 }} />
            )}
            <Typography variant="h6">
              {summaryType === 'cloud' ? '☁️ Cloud AI Summary' : '💻 Local AI Summary'}
            </Typography>
          </Box>
          <IconButton onClick={handleCloseSummaryDialog} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ 
              color: '#1976d2', 
              fontWeight: 600, 
              mb: 2,
              fontSize: '1.1rem'
            }}>
              📄 {summaryDocumentName}
            </Typography>
            
            <Paper sx={{ 
              p: 3,
              background: '#fafafa',
              borderRadius: 2,
              border: '1px solid #e0e0e0'
            }}>              <Typography variant="subtitle2" sx={{ 
                color: summaryType === 'cloud' ? '#2196f3' : '#9c27b0', 
                fontWeight: 600, 
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                {summaryType === 'cloud' ? '🌟 AI-Generated Summary' : '🤖 Local AI Summary'}
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.7,
                  fontSize: '1rem',
                  color: '#333'
                }}
              >
                {summaryContent}
              </Typography>
            </Paper>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, background: '#f5f5f5' }}>
          <Button onClick={handleCloseSummaryDialog} variant="outlined">
            Close
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              const summaryText = `${summaryType === 'cloud' ? 'Cloud AI' : 'Local AI'} Summary of ${summaryDocumentName}:\n\n${summaryContent}`;
              navigator.clipboard.writeText(summaryText);
              alert('Summary copied to clipboard!');
            }}
            disabled={!summaryContent}
            sx={{
              background: summaryType === 'cloud' 
                ? 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)' 
                : 'linear-gradient(90deg, #9c27b0 0%, #e91e63 100%)'
            }}          >
            📋 Copy Summary
          </Button>
        </DialogActions>
      </Dialog>

      {/* Entities Dialog */}
      <Dialog 
        open={entitiesDialogOpen} 
        onClose={handleCloseEntitiesDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '80vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'linear-gradient(90deg, #ff9800 0%, #ffc107 100%)',
          color: 'white',
          pb: 2
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            🏷️ Extracted Entities
          </Typography>
          <IconButton onClick={handleCloseEntitiesDialog} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 3 }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 2, 
                fontWeight: 'bold',
                color: '#ff9800'
              }}
            >
              � {entitiesDocumentName}
            </Typography>
            
            <Paper sx={{ 
              p: 3,
              background: '#fff8e1',
              border: '1px solid #ffcc02',
              borderRadius: 2,
              maxHeight: '50vh',
              overflow: 'auto'
            }}>
              {entitiesContent.length === 0 ? (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    textAlign: 'center',
                    color: '#666',
                    fontStyle: 'italic',
                    py: 4
                  }}
                >
                  No entities found in this document.
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {entitiesContent.map((entity, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        borderRadius: 1,
                        background: '#ffffff',
                        border: '1px solid #e0e0e0',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          boxShadow: '0 2px 8px rgba(255, 152, 0, 0.2)',
                          transform: 'translateY(-1px)'
                        }
                      }}
                    >
                      <Chip
                        label={entity.label}
                        size="small"
                        sx={{
                          background: 'linear-gradient(90deg, #ff9800 0%, #ffc107 100%)',
                          color: 'white',
                          fontWeight: 'bold',
                          minWidth: '80px'
                        }}
                      />
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 'medium',
                          color: '#333',
                          flex: 1
                        }}
                      >
                        {entity.text}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </Paper>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, background: '#f5f5f5' }}>
          <Button onClick={handleCloseEntitiesDialog} variant="outlined">
            Close
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              const entitiesText = entitiesContent.length === 0 
                ? `No entities found in ${entitiesDocumentName}`
                : `Extracted Entities from ${entitiesDocumentName}:\n\n${entitiesContent.map(entity => `${entity.text} (${entity.label})`).join('\n')}`;
              navigator.clipboard.writeText(entitiesText);
              alert('Entities list copied to clipboard!');
            }}
            disabled={entitiesContent.length === 0}
            sx={{
              background: 'linear-gradient(90deg, #ff9800 0%, #ffc107 100%)'
            }}
          >
            📋 Copy Entities
          </Button>
        </DialogActions>
      </Dialog>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </Box>
  );
}

export default DocumentLibrary;