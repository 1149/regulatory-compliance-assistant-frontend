/**
 * API service for policy analysis operations
 */
import { BACKEND_BASE_URL, API_ENDPOINTS, HTTP_METHODS } from '../utils/constants';

/**
 * Analyze policy text
 */
export const analyzePolicy = async (policyText) => {
  const response = await fetch(`${BACKEND_BASE_URL}${API_ENDPOINTS.ANALYZE_POLICY}`, {
    method: HTTP_METHODS.POST,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ policy_text: policyText }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Policy analysis failed: ${errorData.detail || response.statusText}`);
  }
  
  return response.json();
};

/**
 * Policy analysis loading stages for progressive UI feedback
 */
export const POLICY_ANALYSIS_STAGES = [
  { text: "🔍 Analyzing policy structure...", duration: 1000 },
  { text: "🤖 AI is reviewing compliance requirements...", duration: 2000 },
  { text: "📋 Identifying gaps and recommendations...", duration: 1500 },
  { text: "✨ Finalizing your personalized report...", duration: 500 }
];
