/**
 * API service for document-related operations
 */
import { BACKEND_BASE_URL, API_ENDPOINTS, HTTP_METHODS } from '../utils/constants';

/**
 * Fetch all documents from the backend
 */
export const fetchDocuments = async () => {
  const response = await fetch(`${BACKEND_BASE_URL}${API_ENDPOINTS.DOCUMENTS}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch documents: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Delete a document by ID
 */
export const deleteDocument = async (documentId) => {
  const response = await fetch(`${BACKEND_BASE_URL}${API_ENDPOINTS.DOCUMENTS}${documentId}/`, {
    method: HTTP_METHODS.DELETE,
  });
  if (!response.ok) {
    throw new Error(`Failed to delete document: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Get document content for viewing
 */
export const getDocumentContent = async (documentId) => {
  const response = await fetch(`${BACKEND_BASE_URL}${API_ENDPOINTS.DOCUMENTS}${documentId}/content/`);
  if (!response.ok) {
    throw new Error(`Failed to fetch document content: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Search documents
 */
export const searchDocuments = async (query) => {
  const response = await fetch(`${BACKEND_BASE_URL}${API_ENDPOINTS.SEARCH}`, {
    method: HTTP_METHODS.POST,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Get document summary (cloud or local)
 */
export const getDocumentSummary = async (documentId, type = 'cloud') => {
  const endpoint = type === 'cloud' ? API_ENDPOINTS.SUMMARY.CLOUD : API_ENDPOINTS.SUMMARY.LOCAL;
  const response = await fetch(`${BACKEND_BASE_URL}${endpoint}${documentId}/`);
  if (!response.ok) {
    throw new Error(`Failed to get ${type} summary: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Get document entities
 */
export const getDocumentEntities = async (documentId) => {
  const response = await fetch(`${BACKEND_BASE_URL}${API_ENDPOINTS.ENTITIES}${documentId}/`);
  if (!response.ok) {
    throw new Error(`Failed to get entities: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Chat with document
 */
export const chatWithDocument = async (documentId, message) => {
  const response = await fetch(`${BACKEND_BASE_URL}${API_ENDPOINTS.CHAT}`, {
    method: HTTP_METHODS.POST,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document_id: documentId, message }),
  });
  if (!response.ok) {
    throw new Error(`Chat failed: ${response.statusText}`);
  }
  return response.json();
};
