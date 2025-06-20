/**
 * Custom hook for managing policy analysis state and operations
 */
import { useState, useCallback } from 'react';
import { analyzePolicy, POLICY_ANALYSIS_STAGES } from '../services/policyService';

export const usePolicyAnalysis = () => {
  const [userPolicyText, setUserPolicyText] = useState('');
  const [policyAnalysisResult, setPolicyAnalysisResult] = useState(null);
  const [policyAnalysisLoading, setPolicyAnalysisLoading] = useState(false);
  const [policyAnalysisError, setPolicyAnalysisError] = useState(null);
  const [loadingText, setLoadingText] = useState('🔍 Analyzing policy structure...');

  const handlePolicyAnalysis = useCallback(async () => {
    if (!userPolicyText.trim() || policyAnalysisLoading) {
      return;
    }

    setPolicyAnalysisLoading(true);
    setPolicyAnalysisError(null);
    setPolicyAnalysisResult(null);

    // Progressive loading stages for better UX
    let currentStage = 0;
    setLoadingText(POLICY_ANALYSIS_STAGES[0].text);

    const stageInterval = setInterval(() => {
      currentStage++;
      if (currentStage < POLICY_ANALYSIS_STAGES.length) {
        setLoadingText(POLICY_ANALYSIS_STAGES[currentStage].text);
      } else {
        clearInterval(stageInterval);
      }
    }, 1000);

    try {
      const data = await analyzePolicy(userPolicyText);
      clearInterval(stageInterval);
      setPolicyAnalysisResult(data);
    } catch (error) {
      clearInterval(stageInterval);
      setPolicyAnalysisError(`Error during policy analysis: ${error.message}`);
    } finally {
      setPolicyAnalysisLoading(false);
    }
  }, [userPolicyText, policyAnalysisLoading]);

  const clearPolicyAnalysis = useCallback(() => {
    setUserPolicyText('');
    setPolicyAnalysisResult(null);
    setPolicyAnalysisError(null);
    setLoadingText('🔍 Analyzing policy structure...');
  }, []);

  return {
    userPolicyText,
    setUserPolicyText,
    policyAnalysisResult,
    policyAnalysisLoading,
    policyAnalysisError,
    loadingText,
    handlePolicyAnalysis,
    clearPolicyAnalysis,
  };
};
