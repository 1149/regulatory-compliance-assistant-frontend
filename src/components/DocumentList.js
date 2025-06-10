import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, CircularProgress,
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  List, ListItem, ListItemText, Divider, Chip, TextField // Ensure Chip is imported if not already
} from '@mui/material';

function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State for Summary Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [currentSummary, setCurrentSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState('');
  const [currentDocumentName, setCurrentDocumentName] = useState('');
  // State for Entity Dialog
  const [openEntitiesDialog, setOpenEntitiesDialog] = useState(false);
  const [currentEntities, setCurrentEntities] = useState([]);
  const [entitiesLoading, setEntitiesLoading] = useState(false);
  const [entitiesError, setEntitiesError] = useState('');
  const [currentDocumentNameEntities, setCurrentDocumentNameEntities] = useState('');

  // NEW: State for Document Viewer Dialog
  const [openDocumentViewer, setOpenDocumentViewer] = useState(false);
  const [documentTextContent, setDocumentTextContent] = useState('');
  const [documentViewerEntities, setDocumentViewerEntities] = useState([]); // Entities for highlighting
  const [documentViewerLoading, setDocumentViewerLoading] = useState(false);
  const [documentViewerError, setDocumentViewerError] = useState('');
  const [currentDocNameViewer, setCurrentDocNameViewer] = useState('');

//   State for Chatbot in Document Viewer
  const [chatQuery, setChatQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]); // Stores { type: 'user' | 'ai', message: string }
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState('');
  const [currentChatDocumentId, setCurrentChatDocumentId] = useState(null); // To store doc ID for chat


  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://127.0.0.1:8000/api/documents/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDocuments(data);
      } catch (e) {
        setError('Failed to fetch documents. Please ensure backend is running.');
        console.error("Error fetching documents:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // Handle Summarize Button Click (using primary cloud-based LLM)
  const handleSummarize = async (documentId, documentFilename, useLocalLLM = false) => {
    setOpenDialog(true);
    setCurrentSummary('');
    setSummaryError('');
    setSummaryLoading(true);
    setCurrentDocumentName(documentFilename);

    try {
      const textResponse = await fetch(`http://127.0.0.1:8000/api/documents/${documentId}/text`);
      if (!textResponse.ok) {
        throw new Error(`Failed to fetch document text: ${textResponse.statusText}`);
      }
      const documentText = await textResponse.text();

      const summarizeEndpoint = useLocalLLM
        ? 'http://127.0.0.1:8000/api/summarize-text-local/'
        : 'http://127.0.0.1:8000/api/summarize-text/';

      const summarizeResponse = await fetch(summarizeEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: documentText }),
      });

      if (!summarizeResponse.ok) {
        const errorData = await summarizeResponse.json();
        throw new Error(`Failed to get summary: ${errorData.detail || summarizeResponse.statusText}`);
      }
      const data = await summarizeResponse.json();
      setCurrentSummary(data.summary);

    } catch (e) {
      setSummaryError(`Error summarizing document: ${e.message}`);
      console.error('Summarization error:', e);
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentSummary('');
    setSummaryError('');
    setCurrentDocumentName('');
  };

  // Handle View Entities Button Click
  const handleViewEntities = async (documentId, documentFilename) => {
    setOpenEntitiesDialog(true);
    setCurrentEntities([]);
    setEntitiesError('');
    setEntitiesLoading(true);
    setCurrentDocumentNameEntities(documentFilename);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/documents/${documentId}/entities`);
      if (!response.ok) {
        throw new Error(`Failed to fetch entities: ${response.statusText}`);
      }
      const data = await response.json();
      setCurrentEntities(data);
    } catch (e) {
      setEntitiesError(`Error fetching entities: ${e.message}`);
      console.error('Entities fetch error:', e);
    } finally {
      setEntitiesLoading(false);
    }
  };

  const handleCloseEntitiesDialog = () => {
    setOpenEntitiesDialog(false);
    setCurrentEntities([]);
    setEntitiesError('');
    setCurrentDocumentNameEntities('');
  };

  // NEW: Helper function to highlight text with entities
  const highlightText = (text, entities) => {
    if (!text || !entities || entities.length === 0) {
      return <Typography component="span" sx={{ whiteSpace: 'pre-wrap' }}>{text}</Typography>;
    }

    const parts = [];
    const unlocatableEntities = [];
    let lastIndex = 0;

    // Sort entities by start_char to avoid overlapping issues
    // Filter out those that definitely won't be highlighted in-text first
    const locatableEntities = entities.filter(e => e.start_char !== -1 && e.end_char !== -1 && e.start_char < e.end_char);
    const sortedLocatableEntities = [...locatableEntities].sort((a, b) => a.start_char - b.start_char);

    // Process locatable entities for in-text highlighting
    for (const entity of sortedLocatableEntities) {
      // Ensure entity doesn't overlap with previously processed text
      if (entity.start_char < lastIndex) {
        continue; // Skip if it starts before our last processed index (already covered or overlapping badly)
      }

      // Add text before the current entity
      if (entity.start_char > lastIndex) {
        parts.push(text.substring(lastIndex, entity.start_char));
      }

      // Add the highlighted entity text
      const entityText = text.substring(entity.start_char, entity.end_char);
      let highlightColor = '#dcfce7'; // Default light green for SpaCy entities
      if (entity.label === 'COMPLIANCE_CLAUSE') {
        highlightColor = '#bfdfff'; // Light blue for compliance clauses
      }
      // Use a unique key for each part for React's reconciliation
      parts.push(
        <mark key={`${entity.id || entity.start_char}-${entity.label}`} style={{ backgroundColor: highlightColor, padding: '2px 0', borderRadius: '3px' }}>
          {entityText}
          <sup style={{ fontSize: '0.6em', verticalAlign: 'super', marginLeft: '3px', color: '#555' }}>{entity.label}</sup>
        </mark>
      );
      lastIndex = entity.end_char;
    }

    // Add any remaining text after the last highlighted entity
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    // NEW: Collect unlocatable entities (those with start_char == -1 or other invalid positions)
    const unlocatable = entities.filter(e => e.start_char === -1 || e.end_char === -1 || e.start_char >= e.end_char);
    if (unlocatable.length > 0) {
      unlocatableEntities.push(
        <Box key="unlocatable-header" sx={{ mt: 3, mb: 1, borderBottom: '1px dashed #ccc', pb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Identified Clauses (No Exact Position Found):
          </Typography>
        </Box>
      );
      unlocatableEntities.push(
        <List key="unlocatable-list" dense>
          {unlocatable.map((entity, index) => (
            <ListItem key={`unloc-${entity.id || index}`}>
              <Chip label={entity.label} size="small" sx={{ mr: 1, backgroundColor: '#bfdfff' }} />
              <ListItemText primary={entity.text} />
            </ListItem>
          ))}
        </List>
      );
    }

    // Combine text parts and unlocatable entities
    return (
      <React.Fragment>
        <Typography component="span" sx={{ whiteSpace: 'pre-wrap' }}>{parts}</Typography>
        {unlocatableEntities.length > 0 && (
          <Box sx={{ mt: 4, borderTop: '1px solid #eee', pt: 2 }}>
            {unlocatableEntities}
          </Box>
        )}
      </React.Fragment>
    );
  };

  const handleViewDocument = async (documentId, documentFilename) => {
    setOpenDocumentViewer(true);
    setDocumentTextContent('');
    setDocumentViewerEntities([]);
    setDocumentViewerLoading(true);
    setDocumentViewerError('');
    setCurrentDocNameViewer(documentFilename);
    setCurrentChatDocumentId(documentId);

    try {
      // Fetch the document's full text
      const textResponse = await fetch(`http://127.0.0.1:8000/api/documents/${documentId}/text`);
      if (!textResponse.ok) {
        throw new Error(`Failed to fetch document text: ${textResponse.statusText}`);
      }
      const fullText = await textResponse.text();
      setDocumentTextContent(fullText);

      // Fetch the entities for highlighting
      const entitiesResponse = await fetch(`http://127.0.0.1:8000/api/documents/${documentId}/entities`);
      if (!entitiesResponse.ok) {
        throw new Error(`Failed to fetch document entities: ${entitiesResponse.statusText}`);
      }
      const fetchedEntities = await entitiesResponse.json();
      setDocumentViewerEntities(fetchedEntities);

    } catch (e) {
      setDocumentViewerError(`Error loading document: ${e.message}`);
      console.error('Document viewer error:', e);
    } finally {
      setDocumentViewerLoading(false);
    }
  };

  // NEW: Handle Chatbot Query Submission
  const handleChatSubmit = async () => {
    if (!chatQuery.trim() || chatLoading || !currentChatDocumentId) {
      return;
    }

    const userMessage = chatQuery.trim();
    setChatHistory(prev => [...prev, { type: 'user', message: userMessage }]);
    setChatQuery(''); // Clear input
    setChatLoading(true);
    setChatError('');

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/document/${currentChatDocumentId}/qa/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMessage }), // Send query as JSON
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Chatbot error: ${errorData.detail || response.statusText}`);
      }
      const data = await response.json();
      setChatHistory(prev => [...prev, { type: 'ai', message: data.answer || "No answer found." }]);

    } catch (e) {
      setChatError(`Error: ${e.message}`);
      setChatHistory(prev => [...prev, { type: 'ai', message: `Error: ${e.message}` }]);
      console.error('Chatbot API error:', e);
    } finally {
      setChatLoading(false);
    }
  };

  // Handle closing document viewer (reset chat history)
  const handleCloseDocumentViewer = () => {
    setOpenDocumentViewer(false);
    setDocumentTextContent('');
    setDocumentViewerEntities([]);
    setDocumentViewerLoading(false); // Ensure loading is reset
    setDocumentViewerError('');
    setCurrentDocNameViewer('');
    setChatHistory([]); // NEW: Clear chat history
    setChatQuery('');   // NEW: Clear chat input
    setCurrentChatDocumentId(null); // NEW: Reset document ID
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ mt: 4, textAlign: 'center' }}>
        {error}
      </Typography>
    );
  }

  if (documents.length === 0) {
    return (
      <Typography sx={{ mt: 4, textAlign: 'center', color: 'text.secondary' }}>
        No documents uploaded yet. Upload one to see it here!
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Uploaded Documents
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Filename</TableCell>
              <TableCell>Upload Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions (Cloud)</TableCell>
              <TableCell>Actions (Local)</TableCell>
              <TableCell>Entities</TableCell>
              <TableCell>Viewer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">{doc.id}</TableCell>
                <TableCell>{doc.filename}</TableCell>
                <TableCell>{new Date(doc.upload_date).toLocaleString()}</TableCell>
                <TableCell>{doc.status}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleSummarize(doc.id, doc.filename, false)}
                    disabled={doc.status !== 'processed_text'}
                  >
                    Summarize (Cloud)
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => handleSummarize(doc.id, doc.filename, true)}
                    disabled={doc.status !== 'processed_text'}
                  >
                    Summarize (Local)
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleViewEntities(doc.id, doc.filename)}
                    disabled={doc.status !== 'processed_text'}
                  >
                    View Entities
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewDocument(doc.id, doc.filename)}
                    disabled={doc.status !== 'processed_text'}
                  >
                    View Document
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Summary Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>Summary for: {currentDocumentName}</DialogTitle>
        <DialogContent>
          {summaryLoading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                {currentSummary.includes('Local LLM') ? 'Local LLM might take a while...' : 'Summarizing with cloud LLM...'}
              </Typography>
              {currentSummary.includes('Local LLM') && (
                <Typography variant="caption" sx={{ mt: 1, color: 'text.disabled' }}>
                  (This is a demonstration of local inference, performance varies based on hardware.)
                </Typography>
              )}
            </Box>
          ) : summaryError ? (
            <Typography color="error" sx={{ whiteSpace: 'pre-wrap' }}>{summaryError}</Typography>
          ) : (
            <DialogContentText sx={{ whiteSpace: 'pre-wrap' }}>
              {currentSummary || "No summary available."}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Entities Dialog */}
      <Dialog open={openEntitiesDialog} onClose={handleCloseEntitiesDialog} fullWidth maxWidth="sm">
        <DialogTitle>Entities for: {currentDocumentNameEntities}</DialogTitle>
        <DialogContent>
          {entitiesLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : entitiesError ? (
            <Typography color="error" sx={{ whiteSpace: 'pre-wrap' }}>{entitiesError}</Typography>
          ) : (
            <List>
              {currentEntities.length > 0 ? (
                currentEntities.map((entity, index) => (
                  <React.Fragment key={entity.id || index}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography component="span" variant="body1" color="text.primary">
                            {entity.text}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.secondary"
                          >
                            ({entity.label})
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < currentEntities.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                  No entities found for this document.
                </Typography>
              )}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEntitiesDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* NEW: Document Viewer Dialog */}
      <Dialog open={openDocumentViewer} onClose={handleCloseDocumentViewer} fullWidth maxWidth="lg">
        <DialogTitle>Document Viewer: {currentDocNameViewer}</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', height: '80vh' }}>
          {documentViewerLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, flexGrow: 1 }}>
              <CircularProgress />
            </Box>
          ) : documentViewerError ? (
            <Typography color="error">{documentViewerError}</Typography>
          ) : (
            <React.Fragment>
              {/* Document Text Display (scrollable) */}
              <Box sx={{ overflowY: 'auto', flexGrow: 1, p: 2, borderBottom: '1px solid #eee' }}>
                <Typography component="div" variant="body2" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                  {highlightText(documentTextContent, documentViewerEntities)}
                </Typography>
              </Box>

              {/* Chatbot Interface */}
              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', minHeight: '200px', maxHeight: '40%', borderTop: '1px solid #eee', overflowY: 'auto' }}>
                <Typography variant="h6" gutterBottom>Chat with Document</Typography>
                <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 1 }}>
                  {chatHistory.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">Ask me anything about this document!</Typography>
                  ) : (
                    chatHistory.map((msg, index) => (
                      <Box key={index} sx={{ textAlign: msg.type === 'user' ? 'right' : 'left', mb: 1 }}>
                        <Chip
                          label={msg.message}
                          color={msg.type === 'user' ? 'primary' : 'default'}
                          sx={{
                            maxWidth: '80%',
                            height: 'auto',
                            '& .MuiChip-label': {
                              whiteSpace: 'normal',
                              wordWrap: 'break-word',
                              padding: '8px',
                            },
                          }}
                        />
                      </Box>
                    ))
                  )}
                  {chatLoading && (
                    <Box sx={{ textAlign: 'left', mt: 1 }}>
                      <CircularProgress size={24} />
                    </Box>
                  )}
                  {chatError && (
                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>{chatError}</Typography>
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <TextField
                    label="Your question..."
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={chatQuery}
                    onChange={(e) => setChatQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleChatSubmit();
                      }
                    }}
                    disabled={chatLoading}
                  />
                  <Button variant="contained" onClick={handleChatSubmit} disabled={chatLoading}>
                    Send
                  </Button>
                </Box>
              </Box>
            </React.Fragment>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDocumentViewer}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DocumentList;