/**
 * Chat dialog component for document conversations
 */
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Paper,
  IconButton,
  List,
  ListItem,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import LoadingSpinner from '../common/LoadingSpinner';
import { chatWithDocument } from '../../services/documentService';

const ChatDialog = ({
  open,
  onClose,
  documentId,
  documentName,
}) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = { sender: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await chatWithDocument(documentId, chatInput);
      const aiMessage = { sender: 'ai', text: response.response };
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = { 
        sender: 'ai', 
        text: `Sorry, I encountered an error: ${error.message}`,
        isError: true 
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClose = () => {
    setChatMessages([]);
    setChatInput('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          height: '80vh',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(224, 227, 231, 0.5)',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
        color: 'white',
        m: 0
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ChatIcon sx={{ mr: 1 }} />
          <Box>
            <Typography variant="h6" component="div">
              Chat with Document
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {documentName}
            </Typography>
          </Box>
        </Box>
        <IconButton 
          onClick={handleClose} 
          sx={{ color: 'white' }}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Chat Messages */}
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto', 
          p: 2,
          backgroundColor: '#fafafa',
          minHeight: 300
        }}>
          {chatMessages.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%',
              textAlign: 'center',
              color: 'text.secondary'
            }}>
              <Box>
                <SmartToyIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                <Typography variant="body1">
                  Start a conversation about this document!
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Ask questions about the content, request summaries, or get clarifications.
                </Typography>
              </Box>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {chatMessages.map((message, index) => (
                <ListItem key={index} sx={{ p: 0, mb: 2, alignItems: 'flex-start' }}>
                  <Paper
                    sx={{
                      p: 2,
                      maxWidth: '80%',
                      backgroundColor: message.sender === 'user' ? '#e3f2fd' : '#f5f5f5',
                      marginLeft: message.sender === 'user' ? 'auto' : 0,
                      marginRight: message.sender === 'user' ? 0 : 'auto',
                      border: message.isError ? '1px solid #f44336' : 'none',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {message.sender === 'user' ? (
                        <PersonIcon sx={{ mr: 1, fontSize: 18, color: '#1976d2' }} />
                      ) : (
                        <SmartToyIcon sx={{ mr: 1, fontSize: 18, color: message.isError ? '#f44336' : '#757575' }} />
                      )}
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {message.sender === 'user' ? 'You' : 'AI Assistant'}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        whiteSpace: 'pre-wrap',
                        color: message.isError ? '#f44336' : 'inherit'
                      }}
                    >
                      {message.text}
                    </Typography>
                  </Paper>
                </ListItem>
              ))}
              {chatLoading && (
                <ListItem sx={{ p: 0, mb: 2 }}>
                  <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                    <LoadingSpinner 
                      text="AI is thinking..." 
                      size={20}
                      sx={{ p: 0, minHeight: 'auto' }}
                    />
                  </Paper>
                </ListItem>
              )}
            </List>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, backgroundColor: '#fafafa' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask a question about this document..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={chatLoading}
          multiline
          maxRows={3}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton 
                  onClick={handleSendMessage}
                  color="primary"
                  disabled={chatLoading || !chatInput.trim()}
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </DialogActions>
    </Dialog>
  );
};

export default ChatDialog;
