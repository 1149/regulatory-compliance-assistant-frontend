import React, { useState } from 'react'; // Import useState
import Navbar from './components/Navbar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import FileUpload from './components/FileUpload';
import DocumentList from './components/DocumentList';
// Import MUI components for search
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress'; // For loading indicator

function App() {
  // State for semantic search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchError(null);
      return; // Don't search for empty query
    }

    setSearchLoading(true);
    setSearchError(null);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/search/semantic/?query=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        const errorData = await response.json(); // Assuming backend sends JSON error
        throw new Error(`Search failed: ${errorData.detail || response.statusText}`);
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      setSearchError(`Error during semantic search: ${error.message}.`);
      console.error('Semantic search error:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
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
          <FileUpload />
        </Box>

        <Divider sx={{ my: 4 }} /> {/* Visual separator */}

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
                          {/* You could add a small snippet of the document text or summary here later */}
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

        <Divider sx={{ my: 4 }} /> {/* Visual separator */}

        {/* --- Document List Section --- */}
        <DocumentList />
      </Container>
    </div>
  );
}

export default App;
