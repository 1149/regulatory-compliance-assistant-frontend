/**
 * Single document card component
 */
import React from 'react';
import {
  Paper,
  Typography,
  IconButton,
  Box,
  Chip,
  Tooltip,
  Stack,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ChatIcon from '@mui/icons-material/Chat';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import StorageIcon from '@mui/icons-material/Storage';
import { formatDateTime } from '../../utils/dateUtils';

const DocumentCard = ({
  doc,
  onViewDocument,
  onDeleteDocument,
  onShowCloudSummary,
  onShowLocalSummary,
  onShowEntities,
  onOpenChat,
  summaryLoading,
  entitiesLoading,
}) => {
  return (
    <Paper
      sx={{
        p: 3,
        mb: 2,
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(224, 227, 231, 0.5)',
        borderRadius: 3,
        boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 30px 0 rgba(0, 0, 0, 0.15)',
        },
      }}
    >
      {/* Document Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#1976d2',
              mb: 1,
              fontSize: '1.1rem',
              wordBreak: 'break-word',
            }}
          >
            {doc.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
            <Chip
              label={doc.subject || 'Uncategorized'}
              size="small"
              sx={{
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                fontWeight: 600,
              }}
            />
            <Chip
              label={`${doc.page_count || 0} pages`}
              size="small"
              variant="outlined"
            />
          </Box>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', fontSize: '0.875rem' }}
          >
            Uploaded: {formatDateTime(doc.uploaded_at)}
          </Typography>
        </Box>
        
        {/* Delete Button */}
        <Tooltip title="Delete Document">
          <IconButton
            onClick={() => onDeleteDocument(doc)}
            color="error"
            size="small"
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
              },
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Action Buttons */}
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Tooltip title="View Document Content">
          <IconButton
            onClick={() => onViewDocument(doc.id, doc.name)}
            color="primary"
            size="small"
            sx={{
              backgroundColor: 'rgba(25, 118, 210, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.2)',
              },
            }}
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Cloud Summary">
          <IconButton
            onClick={() => onShowCloudSummary(doc.id, doc.name)}
            disabled={summaryLoading[doc.id]}
            color="info"
            size="small"
            sx={{
              backgroundColor: 'rgba(33, 150, 243, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(33, 150, 243, 0.2)',
              },
            }}
          >
            <CloudUploadIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Local Summary">
          <IconButton
            onClick={() => onShowLocalSummary(doc.id, doc.name)}
            disabled={summaryLoading[doc.id]}
            color="secondary"
            size="small"
            sx={{
              backgroundColor: 'rgba(156, 39, 176, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(156, 39, 176, 0.2)',
              },
            }}
          >
            <StorageIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Extract Entities">
          <IconButton
            onClick={() => onShowEntities(doc.id, doc.name)}
            disabled={entitiesLoading[doc.id]}
            color="success"
            size="small"
            sx={{
              backgroundColor: 'rgba(76, 175, 80, 0.1)',                  
              '&:hover': {
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
              },
            }}
          >
            <ListAltIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Chat with Document">
          <IconButton
            onClick={() => onOpenChat(doc.id, doc.name)}
            color="warning"
            size="small"
            sx={{
              backgroundColor: 'rgba(255, 152, 0, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 152, 0, 0.2)',
              },
            }}
          >
            <ChatIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Paper>
  );
};

export default DocumentCard;
