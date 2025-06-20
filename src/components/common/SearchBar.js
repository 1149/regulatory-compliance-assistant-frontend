/**
 * Enhanced search bar component with suggestions and loading states
 */
import React from 'react';
import { 
  TextField, 
  InputAdornment, 
  IconButton, 
  Box, 
  Chip, 
  Typography,
  CircularProgress 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const SearchBar = ({
  value,
  onChange,
  onSearch,
  onClear,
  loading = false,
  placeholder = "Search...",
  suggestions = [],
  showSuggestions = true,
  disabled = false,
  sx = {}
}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onChange({ target: { value: suggestion } });
    if (onSearch) {
      onSearch();
    }
  };

  return (
    <Box sx={sx}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyPress={handleKeyPress}
        disabled={disabled}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                <>
                  {value && (
                    <IconButton 
                      onClick={onClear} 
                      size="small" 
                      sx={{ mr: 0.5 }}
                      disabled={disabled}
                    >
                      <ClearIcon />
                    </IconButton>
                  )}
                  <IconButton 
                    onClick={onSearch} 
                    color="primary"
                    disabled={disabled || !value.trim()}
                  >
                    <SearchIcon />
                  </IconButton>
                </>
              )}
            </InputAdornment>
          ),
          sx: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(25, 118, 210, 0.3)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(25, 118, 210, 0.5)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1976d2',
              borderWidth: 2,
            },
          }
        }}
      />
      
      {showSuggestions && suggestions.length > 0 && !value && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
            Example searches:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {suggestions.map((suggestion, index) => (
              <Chip
                key={index}
                label={suggestion}
                variant="outlined"
                size="small"
                onClick={() => handleSuggestionClick(suggestion)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SearchBar;
