/**
 * DocumentLibrary Component
 * 
 * Main document management interface that provides:
 * - Grouped document display by subject area
 * - Document summarization (cloud and local)
 * - Entity extraction and highlighting
 * - Integrated document chat functionality
 * - Document search across uploaded files
 * - Document viewer with full content display
 */

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
  InputAdornment,
  Snackbar,
  Alert,
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
import SearchIcon from '@mui/icons-material/Search';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const BACKEND_BASE_URL = 'http://127.0.0.1:8000';

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
  // Core state
  const [documents, setDocuments] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState({});
  const [entitiesLoading, setEntitiesLoading] = useState({});
  
  // Chat functionality
  const [chatOpen, setChatOpen] = useState(false);
  const [currentDocId, setCurrentDocId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  
  // Document viewer
  const [documentViewerOpen, setDocumentViewerOpen] = useState(false);
  const [documentContent, setDocumentContent] = useState('');
  const [documentViewerLoading, setDocumentViewerLoading] = useState(false);
  const [currentDocumentName, setCurrentDocumentName] = useState('');
  
  // Summary dialog
  const [summaryDialogOpen, setSummaryDialogOpen] = useState(false);
  const [summaryContent, setSummaryContent] = useState('');
  const [summaryType, setSummaryType] = useState('');
  const [summaryDocumentName, setSummaryDocumentName] = useState('');
  
  // Entities dialog
  const [entitiesDialogOpen, setEntitiesDialogOpen] = useState(false);
  const [entitiesContent, setEntitiesContent] = useState([]);
  const [entitiesDocumentName, setEntitiesDocumentName] = useState('');
  
  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [lastSearchQuery, setLastSearchQuery] = useState('');
  
  // Delete confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Notifications
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationSeverity, setNotificationSeverity] = useState('success');
  const groupDocumentsBySubject = (documents) => {
    const grouped = {};
    
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
    
    // Sort documents by upload date (latest first)
    Object.keys(grouped).forEach(subject => {
      grouped[subject].sort((a, b) => {
        const dateA = new Date(a.upload_date);
        const dateB = new Date(b.upload_date);
        return dateB - dateA;
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
  }, [refresh]);

  const handleExpandClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };  const handleDelete = async (id) => {
    const document = documents.find(doc => doc.id === id);
    setDocumentToDelete(document);
    setDeleteConfirmOpen(true);
  };  const handleConfirmDelete = async () => {
    if (!documentToDelete) return;
    
    setDeleteLoading(true);
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/documents/${documentToDelete.id}/`, { method: 'DELETE' });
      
      if (!response.ok) {
        throw new Error(`Failed to delete document: ${response.status} ${response.statusText}`);
      }
      
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentToDelete.id));
      setDeleteConfirmOpen(false);
      setDocumentToDelete(null);
      
      setNotificationMessage(`Document "${documentToDelete.filename}" deleted successfully!`);
      setNotificationSeverity('success');
      setNotificationOpen(true);
    } catch (error) {
      console.error('Error deleting document:', error);
      setNotificationMessage(`Failed to delete document: ${error.message}`);
      setNotificationSeverity('error');
      setNotificationOpen(true);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setDocumentToDelete(null);
    setDeleteLoading(false);
  };  const handleSummarizeCloud = async (docId) => {
    setSummaryLoading(prev => ({ ...prev, [docId]: true }));
    try {
      const textResponse = await fetch(`${BACKEND_BASE_URL}/api/documents/${docId}/text`);
      if (!textResponse.ok) {
        throw new Error('Failed to fetch document text');
      }
      const documentText = await textResponse.text();

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
    setEntitiesDialogOpen(false);    setEntitiesContent([]);
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
  // Search functionality for integrated search within uploaded documents
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchError('Please enter a search query');
      return;
    }

    const currentQuery = searchQuery.trim();
    setLastSearchQuery(currentQuery); // Save what was searched
    setSearchLoading(true);
    setSearchError('');
    setSearchResults([]);

    try {
      // Get all document texts and perform semantic search
      const searchPromises = documents.map(async (doc) => {
        try {
          // Get document text (to verify document is accessible)
          const textResponse = await fetch(`${BACKEND_BASE_URL}/api/documents/${doc.id}/text`);
          if (!textResponse.ok) {
            console.warn(`Failed to fetch text for document ${doc.id}`);
            return null;
          }
          
          // Use the document QA endpoint for semantic search
          const qaResponse = await fetch(`${BACKEND_BASE_URL}/api/document/${doc.id}/qa/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: currentQuery }),
          });

          if (!qaResponse.ok) {
            console.warn(`Failed to search in document ${doc.id}`);
            return null;
          }

          const qaResult = await qaResponse.json();
          
          // Return result with document context
          return {
            document_id: doc.id,
            filename: doc.filename,
            subject: doc.subject,
            upload_date: doc.upload_date,
            content: qaResult.answer,
            similarity: 0.8, // Default similarity since QA endpoint doesn't return this
          };
        } catch (error) {
          console.warn(`Error searching document ${doc.id}:`, error);
          return null;
        }
      });

      const results = await Promise.all(searchPromises);
      const validResults = results.filter(result => result !== null && result.content && result.content.toLowerCase() !== 'i couldn\'t find any highly relevant sections in the document for your question.');
      
      setSearchResults(validResults);
      
      // Clear search input after successful search
      setSearchQuery('');
      
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('Search failed. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleViewDocumentFromSearch = (documentId) => {
    const document = documents.find(doc => doc.id === documentId);
    if (document) {
      handleViewDocument(documentId);
    }
  };

  return (
    <Box sx={{ width: '100%', mx: 'auto', mt: 4 }}>      <Paper
        elevation={4}
        sx={{
          p: 4,
          background: 'rgba(244, 246, 248, 0.95)', // Semi-transparent background
          backdropFilter: 'blur(15px)', // Glass effect
          borderRadius: 4,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.20)',
          border: '1px solid rgba(224, 227, 231, 0.5)',
          width: '100%',
          minHeight: 350,
        }}      ><Typography
          variant="h6"
          sx={{
            fontFamily: '"Inter", "Poppins", "Roboto", "Arial", sans-serif',
            fontWeight: 700,
            mb: 3,
            color: 'transparent',
            background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 50%, #42a5f5 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' },
            letterSpacing: '0.5px',
            textShadow: '0 2px 4px rgba(25, 118, 210, 0.2)',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: 0,
              width: '60px',
              height: '3px',
              background: 'linear-gradient(90deg, #1976d2, #64b5f6)',
              borderRadius: '2px',
              opacity: 0.8,
            }
          }}
        >
          <DescriptionIcon sx={{ 
            mr: 1.5, 
            verticalAlign: 'middle', 
            color: '#388e3c',
            fontSize: 32,
            filter: 'drop-shadow(0 2px 4px rgba(56, 142, 60, 0.3))',
            transition: 'transform 0.2s ease',
            '&:hover': {
              transform: 'scale(1.1)',
            }
          }} />
          Uploaded Documents
        </Typography>

        {/* Scroll Indicator */}
        {documents && documents.length > 3 && (
          <Box sx={{ 
            mb: 2, 
            textAlign: 'center',
            opacity: 0.7
          }}>
            <Typography variant="caption" sx={{ 
              color: '#666', 
              fontSize: '0.75rem',
              background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
              px: 2,
              py: 0.5,
              borderRadius: 2,
              border: '1px solid #bbdefb'
            }}>
              📋 Documents section is scrollable when you have many subjects
            </Typography>
          </Box>
        )}

        {/* Integrated Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="🔍 Search across all documents... (e.g., 'data privacy requirements', 'security policies', 'compliance standards')"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">                  <Button
                    variant="contained"
                    onClick={handleSearch}
                    disabled={searchLoading || !searchQuery.trim()}
                    sx={{
                      background: searchLoading 
                        ? 'linear-gradient(45deg, #4fc3f7 0%, #81c784 50%, #4fc3f7 100%)' 
                        : 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                      backgroundSize: searchLoading ? '200% 100%' : '100% 100%',
                      animation: searchLoading ? 'gradientShift 2s ease-in-out infinite' : 'none',
                      minWidth: searchLoading ? 140 : 'auto',
                      px: searchLoading ? 2 : 2,
                      py: 1,
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        background: searchLoading 
                          ? 'linear-gradient(45deg, #4fc3f7 0%, #81c784 50%, #4fc3f7 100%)' 
                          : 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)',
                        transform: searchLoading ? 'none' : 'scale(1.05)',
                      },
                      '&:disabled': {
                        background: 'linear-gradient(90deg, #e0e0e0 0%, #f0f0f0 100%)',
                        color: '#999',
                      },
                      '@keyframes gradientShift': {
                        '0%': { backgroundPosition: '0% 50%' },
                        '50%': { backgroundPosition: '100% 50%' },
                        '100%': { backgroundPosition: '0% 50%' }
                      }
                    }}
                  >
                    {searchLoading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CircularProgress 
                          size={20} 
                          thickness={3}
                          color="inherit" 
                          sx={{
                            animation: 'pulse 1.5s ease-in-out infinite',
                            '@keyframes pulse': {
                              '0%': { opacity: 0.6, transform: 'scale(0.8)' },
                              '50%': { opacity: 1, transform: 'scale(1)' },
                              '100%': { opacity: 0.6, transform: 'scale(0.8)' }
                            }
                          }}
                        />
                        <Typography variant="caption" sx={{ 
                          fontWeight: 700, 
                          fontSize: '0.8rem',
                          letterSpacing: '0.5px',
                          animation: 'fadeInOut 2s ease-in-out infinite',
                          '@keyframes fadeInOut': {
                            '0%': { opacity: 0.7 },
                            '50%': { opacity: 1 },
                            '100%': { opacity: 0.7 }
                          }
                        }}>
                          Searching...
                        </Typography>
                      </Box>
                    ) : (
                      <SearchIcon sx={{ 
                        fontSize: 22,
                        transition: 'all 0.2s ease',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                      }} />
                    )}
                  </Button>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                background: '#fff',
              },
            }}
          />
          {searchError && (
            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
              {searchError}
            </Typography>
          )}
        </Box>        {/* Search Results */}
        {searchResults.length > 0 && (
          <Box sx={{ mb: 3 }}>
            {/* Search summary moved to top */}
            {lastSearchQuery && (
              <Box sx={{ 
                mb: 3, 
                p: 3, 
                background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)', 
                borderRadius: 3, 
                border: '1px solid #bbdefb',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)'
              }}>
                <Typography variant="h6" sx={{ 
                  color: '#1976d2', 
                  fontWeight: 700,
                  mb: 1,
                  fontSize: '1.1rem'
                }}>
                  🔍 Search Results
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: '#424242', 
                  mb: 1,
                  fontSize: '1rem'
                }}>
                  You searched for: <strong>"{lastSearchQuery}"</strong>
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#666', 
                  fontSize: '0.9rem'
                }}>
                  Found {searchResults.length} relevant {searchResults.length === 1 ? 'result' : 'results'} across your documents
                </Typography>
              </Box>
            )}
            <Stack spacing={2}>
              {searchResults.map((result, index) => {
                const document = documents.find(doc => doc.id === result.document_id);
                return (
                  <Paper 
                    key={index}
                    sx={{ 
                      p: 3,
                      background: '#fff',
                      borderRadius: 2,
                      border: '1px solid #e0e0e0',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    {/* Document Header */}
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      mb: 2
                    }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: '#1976d2', 
                            fontWeight: 600,
                            mb: 1,
                            fontSize: '1.1rem'
                          }}
                        >
                          📄 {document?.filename || `Document ${result.document_id}`}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          <Chip 
                            label={document?.subject || 'Uncategorized'}
                            size="small"
                            sx={{ 
                              background: '#e3f2fd',
                              color: '#1976d2',
                              fontWeight: 600
                            }}
                          />
                          <Chip 
                            label={`Relevance: ${Math.round((result.similarity || 0) * 100)}%`}
                            size="small"
                            sx={{ 
                              background: result.similarity > 0.7 ? '#e8f5e9' : '#fff3e0',
                              color: result.similarity > 0.7 ? '#2e7d32' : '#f57c00',
                              fontWeight: 600
                            }}
                          />
                        </Box>
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewDocumentFromSearch(result.document_id)}
                        sx={{ ml: 2 }}
                      >
                        View Document
                      </Button>
                    </Box>

                    {/* Relevant Content Preview */}
                    <Box sx={{ 
                      background: '#f8f9fa',
                      borderRadius: 2,
                      p: 2,
                      border: '1px solid #e9ecef'
                    }}>
                      <Typography variant="subtitle2" sx={{ 
                        color: '#1976d2', 
                        fontWeight: 600, 
                        mb: 1,
                        fontSize: '0.9rem'
                      }}>
                        🎯 Relevant Content:
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          lineHeight: 1.6,
                          color: '#333',
                          fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
                          whiteSpace: 'pre-wrap'
                        }}
                      >
                        {result.content || 'Content preview not available'}
                      </Typography>
                    </Box>

                    {/* Document Info */}
                    <Box sx={{ 
                      mt: 2, 
                      pt: 2, 
                      borderTop: '1px solid #e0e0e0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <Typography variant="caption" color="text.secondary">
                        📅 Uploaded: {document ? formatDateTime(document.upload_date) : 'Unknown'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        🆔 Document ID: {result.document_id}
                      </Typography>
                    </Box>
                  </Paper>
                );              })}            </Stack>
            
            <Divider sx={{ my: 3 }} />
          </Box>
        )}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress size={40} />
          </Box>        ) : (          <>
            {!documents || documents.length === 0 ? (
              <Typography variant="h6" color="text.secondary" align="center" sx={{ my: 2, fontWeight: 400 }}>
                No documents uploaded yet.
              </Typography>
            ) : (              <Box 
                sx={{ 
                  maxHeight: '70vh', // Set maximum height
                  overflowY: 'auto', // Enable vertical scrolling
                  overflowX: 'hidden', // Hide horizontal scrolling
                  pr: 1, // Add padding for scrollbar
                  pl: 0.5, // Small left padding
                  py: 1, // Vertical padding
                  position: 'relative',
                  borderRadius: 2,
                  border: '2px solid transparent',
                  background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%) border-box',
                  // Custom scrollbar styling for WebKit browsers (Chrome, Safari, Edge)
                  '&::-webkit-scrollbar': {
                    width: '12px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#f8f9fa',
                    borderRadius: '10px',
                    border: '1px solid #e9ecef',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                    borderRadius: '10px',
                    border: '2px solid #f8f9fa',
                    boxShadow: '0 2px 4px rgba(25, 118, 210, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                      transform: 'scale(1.05)',
                    },
                    '&:active': {
                      background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)',
                    }
                  },
                  // Firefox scrollbar styling
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#1976d2 #f8f9fa',
                  // Add scroll indicators with shadows
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 12, // Account for scrollbar
                    height: '15px',
                    background: 'linear-gradient(to bottom, rgba(227, 242, 253, 0.8), transparent)',
                    pointerEvents: 'none',
                    zIndex: 2,
                    borderRadius: '8px 8px 0 0',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 12, // Account for scrollbar
                    height: '15px',
                    background: 'linear-gradient(to top, rgba(227, 242, 253, 0.8), transparent)',
                    pointerEvents: 'none',
                    zIndex: 2,
                    borderRadius: '0 0 8px 8px',
                  }
                }}
              >
                {(() => {
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
                                <Box                                  sx={{
                                    px: 3,
                                    py: 3,
                                    background: '#e3f2fd',
                                    borderRadius: 0,
                                    mb: 0,
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
                  );                }).filter(Boolean); // Filter out any null results
                })()}
              </Box>
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
            📋 Copy Entities          </Button>        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCancelDelete}
        maxWidth="sm"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #f44336 0%, #e57373 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          py: 3
        }}>
          <WarningIcon sx={{ fontSize: 32, color: '#ffeb3b' }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              Confirm Document Deletion
            </Typography>
            <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
              This action cannot be undone
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'flex-start',
            gap: 2,
            mb: 3
          }}>
            <ErrorOutlineIcon sx={{ 
              color: '#f44336', 
              fontSize: 28,
              mt: 0.5
            }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" sx={{ 
                fontWeight: 600, 
                mb: 2,
                color: '#333'
              }}>
                Are you sure you want to permanently delete this document?
              </Typography>
              
              {documentToDelete && (
                <Paper sx={{ 
                  p: 2, 
                  background: '#f8f9fa',
                  border: '2px solid #ffeaa7',
                  borderRadius: 2
                }}>
                  <Typography variant="subtitle2" sx={{ 
                    color: '#d63031', 
                    fontWeight: 700,
                    mb: 1
                  }}>
                    📄 Document to be deleted:
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    fontWeight: 600,
                    color: '#2d3436',
                    mb: 1
                  }}>
                    <strong>Name:</strong> {documentToDelete.filename}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: '#636e72',
                    mb: 1
                  }}>
                    <strong>Subject:</strong> {documentToDelete.subject || 'Uncategorized'}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: '#636e72'
                  }}>
                    <strong>Uploaded:</strong> {formatDateTime(documentToDelete.upload_date)}
                  </Typography>
                </Paper>
              )}
            </Box>
          </Box>
          
          <Box sx={{ 
            background: 'linear-gradient(135deg, #ffe0e0 0%, #ffecec 100%)',
            border: '1px solid #ffcdd2',
            borderRadius: 2,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <WarningIcon sx={{ color: '#f44336', fontSize: 20 }} />
            <Typography variant="caption" sx={{ 
              color: '#d32f2f',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}>
              This will permanently remove the document from the database and delete the file from storage.
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ 
          p: 3, 
          background: '#fafafa',
          gap: 2,
          justifyContent: 'flex-end'
        }}>
          <Button 
            onClick={handleCancelDelete}
            variant="outlined"
            disabled={deleteLoading}
            sx={{
              px: 3,
              py: 1,
              borderColor: '#9e9e9e',
              color: '#424242',
              '&:hover': {
                borderColor: '#757575',
                background: '#f5f5f5'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete}
            variant="contained"
            disabled={deleteLoading}
            sx={{
              px: 4,
              py: 1,
              background: deleteLoading 
                ? 'linear-gradient(90deg, #ef5350 0%, #e57373 100%)' 
                : 'linear-gradient(90deg, #f44336 0%, #e53935 100%)',
              color: 'white',
              fontWeight: 700,
              '&:hover': {
                background: 'linear-gradient(90deg, #d32f2f 0%, #c62828 100%)',
                transform: deleteLoading ? 'none' : 'scale(1.02)'
              },
              '&:disabled': {
                background: 'linear-gradient(90deg, #ffcdd2 0%, #ef9a9a 100%)',
                color: '#999'
              }
            }}
          >
            {deleteLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={18} color="inherit" />
                <Typography variant="button" sx={{ fontSize: '0.85rem' }}>
                  Deleting...
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DeleteIcon sx={{ fontSize: 18 }} />
                <Typography variant="button" sx={{ fontSize: '0.85rem' }}>
                  Delete Permanently
                </Typography>
              </Box>
            )}          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Notification */}
      <Snackbar
        open={notificationOpen}
        autoHideDuration={4000}
        onClose={() => setNotificationOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setNotificationOpen(false)}
          severity={notificationSeverity}
          variant="filled"
          sx={{
            width: '100%',
            borderRadius: 2,
            fontWeight: 600,
            '& .MuiAlert-icon': {
              fontSize: '1.5rem'
            }
          }}
        >
          {notificationMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default DocumentLibrary;