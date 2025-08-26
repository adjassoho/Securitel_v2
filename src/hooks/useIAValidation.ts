import { useState } from 'react';
import { iaAnalysisService } from '@/services/iaAnalysisService';
import toast from 'react-hot-toast';

interface IAValidationResult {
  isValid: boolean;
  errors: string[];
  extractedData: any;
}

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
        extractedData: analysisResult.extractedData
      };
      
      // Stocker les résultats
      setAnalysisResults(prev => ({
        ...prev,
        [dataType]: result
      }));
      
      // Afficher les erreurs si nécessaire
      if (!validation.isValid) {
        validation.errors.forEach(error => {
          toast.error(error);
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
        extractedData: {}
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