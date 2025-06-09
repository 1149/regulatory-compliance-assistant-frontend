import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, CircularProgress,
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  List, ListItem, ListItemText, Divider
} from '@mui/material'; // NEW: Import Button, Dialog components

function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentSummary, setCurrentSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState('');
  const [currentDocumentName, setCurrentDocumentName] = useState('');
  const [openEntitiesDialog, setOpenEntitiesDialog] = useState(false);
  const [currentEntities, setCurrentEntities] = useState([]);
  const [entitiesLoading, setEntitiesLoading] = useState(false);
  const [entitiesError, setEntitiesError] = useState('');
  const [currentDocumentNameEntities, setCurrentDocumentNameEntities] = useState('');

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
  }, []); // Empty dependency array means this runs once on mount

  //  Handle Summarize Button Click (using primary cloud-based LLM)
  const handleSummarize = async (documentId, documentFilename, useLocalLLM = false) => {
    setOpenDialog(true);
    setCurrentSummary('');
    setSummaryError('');
    setSummaryLoading(true);
    setCurrentDocumentName(documentFilename);

    try {
      // Fetch the document's text first
      const textResponse = await fetch(`http://127.0.0.1:8000/api/documents/${documentId}/text`);
      if (!textResponse.ok) {
        throw new Error(`Failed to fetch document text: ${textResponse.statusText}`);
      }
      const documentText = await textResponse.text(); // text() because the endpoint returns plain string

      // NEW: Add console.log to check content and type
      console.log("Fetched document text length:", documentText.length);
      console.log("Fetched document text (first 100 chars):", documentText.substring(0, 100));
      console.log("Type of fetched documentText:", typeof documentText);

      // Determine which summarization endpoint to use
      const summarizeEndpoint = useLocalLLM 
        ? 'http://127.0.0.1:8000/api/summarize-text-local/' 
        : 'http://127.0.0.1:8000/api/summarize-text/'; // Primary: Gemini (cloud)

      const summarizeResponse = await fetch(summarizeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentSummary('');
    setSummaryError('');
    setCurrentDocumentName('');
  };

  const handleCloseEntitiesDialog = () => {
    setOpenEntitiesDialog(false);
    setCurrentEntities([]);
    setEntitiesError('');
    setCurrentDocumentNameEntities('');
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
              <TableCell>Entities</TableCell> {/* NEW: Entities column */}
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
                <TableCell> {/* NEW: Entities cell */}
                  <Button 
                    variant="contained" 
                    size="small" 
                    onClick={() => handleViewEntities(doc.id, doc.filename)}
                    disabled={doc.status !== 'processed_text'}
                  >
                    View Entities
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

      {/* NEW: Entities Dialog */}
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
    </Box>
  );
}

export default DocumentList;