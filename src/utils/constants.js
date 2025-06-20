/**
 * Application constants and configuration
 */

export const BACKEND_BASE_URL = 'http://127.0.0.1:8000';

export const API_ENDPOINTS = {
  DOCUMENTS: '/api/documents/',
  UPLOAD: '/api/upload/',
  ANALYZE_POLICY: '/api/analyze-policy/',
  CHAT: '/api/chat/',
  SEARCH: '/api/search/',
  SUMMARY: {
    CLOUD: '/api/summary/cloud/',
    LOCAL: '/api/summary/local/',
  },
  ENTITIES: '/api/entities/',
};

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  DELETE: 'DELETE',
  PUT: 'PUT',
  PATCH: 'PATCH',
};

export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};
