/**
 * Document search results component
 */
import React from 'react';
import { 
  Box, 
  Typography, 
  Chip, 
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip 
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { formatDateTime } from '../../utils/dateUtils';

const DocumentSearchResults = ({ 
  searchResults, 
  lastSearchQuery, 
  onViewDocument 
}) => {
  if (searchResults.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 600 }}>
        Search Results for "{lastSearchQuery}"
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
        Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
      </Typography>
      
      <Paper sx={{ 
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(227, 242, 253, 0.9) 100%)',
        border: '1px solid rgba(25, 118, 210, 0.2)',
        borderRadius: 2,
        overflow: 'hidden'
      }}>
        <List>
          {searchResults.map((result, index) => (
            <ListItem
              key={index}
              sx={{
                borderBottom: index < searchResults.length - 1 ? '1px solid rgba(25, 118, 210, 0.1)' : 'none',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.05)',
                }
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {result.document_name}
                    </Typography>
                    <Chip 
                      label={result.subject || 'Uncategorized'} 
                      size="small" 
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                      {result.snippet}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Uploaded: {formatDateTime(result.uploaded_at)} | 
                      Relevance: {(result.relevance_score * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                }
              />
              <Tooltip title="View Document">
                <IconButton 
                  onClick={() => onViewDocument(result.document_id, result.document_name)}
                  color="primary"
                  size="small"
                >
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default DocumentSearchResults;
