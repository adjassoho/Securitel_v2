import { useState } from 'react';
import { iaAnalysisService } from '@/services/iaAnalysisService';
import { IAValidationResult } from '@/types';
import toast from 'react-hot-toast';

interface UseIAValidationReturn {
  validateImage: (file: File, dataType: 'imei' | 'serial' | 'specs', userInput: any) => Promise<IAValidationResult>;
  isAnalyzing: boolean;
  analysisResults: Record<string, IAValidationResult>;
}

export const useIAValidation = (): UseIAValidationReturn => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<Record<string, IAValidationResult>>({});

  const validateImage = async (
    file: File,
    dataType: 'imei' | 'serial' | 'specs',
    userInput: any
  ): Promise<IAValidationResult> => {
    console.log('Début de la validation IA pour le type:', dataType);
    console.log('Données utilisateur:', userInput);
    setIsAnalyzing(true);
    
    try {
      // Analyser l'image avec l'IA
      const analysisResult = await iaAnalysisService.analyzeImage(file, dataType);
      console.log('Résultat de l\'analyse:', analysisResult);
      
      // Valider les données extraites par rapport aux données saisies
      const validation = iaAnalysisService.validateExtractedData(
        analysisResult.extractedData,
        userInput,
        dataType
      );
      console.log('Résultat de la validation:', validation);
      
      const result: IAValidationResult = {
        isValid: validation.isValid,
        errors: validation.errors,
        warnings: validation.warnings || [],
        suggestions: validation.suggestions || [],
        extractedData: analysisResult.extractedData,
        imeiCount: analysisResult.imeiCount || 0,
        userImeiCount: dataType === 'imei' ? 
          ((userInput.imei1 ? 1 : 0) + (userInput.imei2 ? 1 : 0)) : 0
      };
      
      // Stocker les résultats
      setAnalysisResults(prev => ({
        ...prev,
        [dataType]: result
      }));
      
      // Afficher les messages appropriés
      if (!validation.isValid && validation.errors.length > 0) {
        validation.errors.forEach(error => {
          toast.error(error);
        });
      }
      
      if (validation.warnings && validation.warnings.length > 0) {
        validation.warnings.forEach(warning => {
          toast(warning, { icon: '⚠️', duration: 5000 });
        });
      }
      
      if (validation.suggestions && validation.suggestions.length > 0) {
        validation.suggestions.forEach(suggestion => {
          toast(suggestion, { 
            icon: '💡', 
            duration: 8000,
            style: {
              background: '#3b82f6',
              color: 'white'
            }
          });
        });
      }
      
      console.log('Validation terminée:', result);
      
      return result;
    } catch (error: any) {
      console.error('Erreur lors de la validation IA:', error);
      const errorMessage = error.message || 'Impossible d\'analyser l\'image pour le moment. Veuillez réessayer.';
      toast.error(errorMessage);
      
      const result: IAValidationResult = {
        isValid: false,
        errors: [errorMessage],
        warnings: [],
        suggestions: [],
        extractedData: {},
        imeiCount: 0,
        userImeiCount: 0
      };
      
      setAnalysisResults(prev => ({
        ...prev,
        [dataType]: result
      }));
      
      return result;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    validateImage,
    isAnalyzing,
    analysisResults
  };
};