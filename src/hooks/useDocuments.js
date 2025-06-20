/**
 * Custom hook for managing document-related state and operations
 */
import { useState, useEffect, useCallback } from 'react';
import { 
  fetchDocuments, 
  deleteDocument, 
  getDocumentContent,
  searchDocuments,
  getDocumentSummary,
  getDocumentEntities,
  chatWithDocument 
} from '../services/documentService';

export const useDocuments = (refresh) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load documents
  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDocuments();
      setDocuments(data.documents || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete document
  const handleDeleteDocument = useCallback(async (documentId) => {
    try {
      await deleteDocument(documentId);
      await loadDocuments(); // Refresh list
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [loadDocuments]);

  // Group documents by subject
  const groupDocumentsBySubject = useCallback((documents) => {
    const grouped = {};
    documents.forEach((doc) => {
      const subject = doc.subject || 'Uncategorized';
      if (!grouped[subject]) {
        grouped[subject] = [];
      }
      grouped[subject].push(doc);
    });
    return grouped;
  }, []);

  // Load documents on mount and refresh
  useEffect(() => {
    loadDocuments();
  }, [loadDocuments, refresh]);

  return {
    documents,
    loading,
    error,
    loadDocuments,
    handleDeleteDocument,
    groupDocumentsBySubject,
  };
};

export const useDocumentViewer = () => {
  const [documentViewerOpen, setDocumentViewerOpen] = useState(false);
  const [documentContent, setDocumentContent] = useState('');
  const [documentViewerLoading, setDocumentViewerLoading] = useState(false);
  const [currentDocumentName, setCurrentDocumentName] = useState('');

  const openDocumentViewer = useCallback(async (documentId, documentName) => {
    try {
      setDocumentViewerLoading(true);
      setCurrentDocumentName(documentName);
      setDocumentViewerOpen(true);
      
      const data = await getDocumentContent(documentId);
      setDocumentContent(data.content || 'No content available.');
    } catch (err) {
      setDocumentContent(`Error loading document: ${err.message}`);
    } finally {
      setDocumentViewerLoading(false);
    }
  }, []);

  const closeDocumentViewer = useCallback(() => {
    setDocumentViewerOpen(false);
    setDocumentContent('');
    setCurrentDocumentName('');
  }, []);

  return {
    documentViewerOpen,
    documentContent,
    documentViewerLoading,
    currentDocumentName,
    openDocumentViewer,
    closeDocumentViewer,
  };
};

export const useDocumentSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [lastSearchQuery, setLastSearchQuery] = useState('');

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim() || searchLoading) return;

    try {
      setSearchLoading(true);
      setSearchError('');
      const data = await searchDocuments(searchQuery);
      setSearchResults(data.results || []);
      setLastSearchQuery(searchQuery);
    } catch (err) {
      setSearchError(err.message);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, [searchQuery, searchLoading]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setSearchError('');
    setLastSearchQuery('');
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    searchLoading,
    searchError,
    lastSearchQuery,
    handleSearch,
    clearSearch,
  };
};
