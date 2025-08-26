import { useState, useRef } from 'react';
import { phoneService } from '@/services/api';
import { Upload, Check, AlertCircle, X, FileImage, Search, Loader2, Smartphone, Hash, CheckCircle } from 'lucide-react';
import { useIAValidation } from '@/hooks/useIAValidation';
import IAValidationIndicator from '@/components/ui/IAValidationIndicator';
import toast from 'react-hot-toast';

interface UploadedFile {
  file: File;
  preview: string;
}

interface IAValidationResult {
  isValid: boolean;
  errors: string[];
  extractedData: {
    imei?: string;
    serialNumber?: string;
  };
}

const IAVerificationSection = () => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [iaValidation, setIaValidation] = useState<IAValidationResult | null>(null);
  const [isIaValidating, setIsIaValidating] = useState(false);
  const [manualImei, setManualImei] = useState('');
  const [manualSerial, setManualSerial] = useState('');
  const [comparisonResult, setComparisonResult] = useState<{isValid: boolean; errors: string[]} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { validateImage } = useIAValidation();

  const handleFileUpload = (file: File) => {
    if (file) {
      const preview = URL.createObjectURL(file);
      setUploadedFile({ file, preview });
      
      // Réinitialiser les états
      setIaValidation(null);
      setComparisonResult(null);
      setManualImei('');
      setManualSerial('');
      
      // Déclencher la validation IA automatiquement après l'upload
      setTimeout(() => {
        validateWithIA(file);
      }, 1000);
    }
  };

  const removeFile = () => {
    if (uploadedFile) {
      URL.revokeObjectURL(uploadedFile.preview);
    }
    setUploadedFile(null);
    setIaValidation(null);
    setComparisonResult(null);
    setManualImei('');
    setManualSerial('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateWithIA = async (file: File) => {
    console.log('Début de la validation IA avec le fichier:', file.name);
    setIsIaValidating(true);
    
    try {
      // Analyser l'image avec l'IA pour extraire IMEI et numéro de série
      const result = await validateImage(file, 'imei', {});
      console.log('Résultat de la validation IA:', result);
      
      setIaValidation(result);
      
      if (result.isValid && result.extractedData) {
        toast.success('Vérification IA réussie !');
      } else if (!result.isValid) {
        toast.error('La vérification IA a échoué. Veuillez corriger les erreurs.');
      }
    } catch (error: any) {
      console.error('Erreur lors de la validation IA:', error);
      const errorMessage = error.message || 'Une erreur est survenue lors de la vérification IA.';
      toast.error(errorMessage);
      
      // Créer un résultat d'erreur pour l'affichage
      setIaValidation({
        isValid: false,
        errors: [errorMessage],
        extractedData: {}
      });
    } finally {
      setIsIaValidating(false);
    }
  };

  const handleCompareData = () => {
    if (!iaValidation?.extractedData) return;
    
    const errors: string[] = [];
    
    // Comparer l'IMEI
    if (iaValidation.extractedData.imei && manualImei) {
      const cleanExtractedImei = iaValidation.extractedData.imei.replace(/\s+/g, '');
      const cleanManualImei = manualImei.replace(/\s+/g, '');
      
      if (cleanExtractedImei !== cleanManualImei) {
        errors.push(`L'IMEI extrait (${cleanExtractedImei}) ne correspond pas à l'IMEI saisi (${cleanManualImei})`);
      }
    }
    
    // Comparer le numéro de série
    if (iaValidation.extractedData.serialNumber && manualSerial) {
      const cleanExtractedSerial = iaValidation.extractedData.serialNumber.replace(/\s+/g, '');
      const cleanManualSerial = manualSerial.replace(/\s+/g, '');
      
      if (cleanExtractedSerial !== cleanManualSerial) {
        errors.push(`Le numéro de série extrait (${cleanExtractedSerial}) ne correspond pas au numéro de série saisi (${cleanManualSerial})`);
      }
    }
    
    const isValid = errors.length === 0;
    
    setComparisonResult({ isValid, errors });
    
    if (isValid) {
      toast.success('Les données saisies correspondent aux données extraites !');
    } else {
      toast.error('Les données saisies ne correspondent pas aux données extraites.');
    }
  };

  const handleVerifyExtractedData = async () => {
    if (!iaValidation?.extractedData) return;
    
    try {
      // Vérifier l'IMEI extrait
      if (iaValidation.extractedData.imei) {
        const result = await phoneService.verifyIMEI(iaValidation.extractedData.imei);
        // Vous pouvez gérer le résultat ici selon vos besoins
        console.log('Résultat de vérification IMEI:', result);
        toast.success('Vérification IMEI effectuée avec succès !');
      }
      
      // Vérifier le numéro de série extrait
      if (iaValidation.extractedData.serialNumber) {
        const result = await phoneService.verifySerial(iaValidation.extractedData.serialNumber);
        // Vous pouvez gérer le résultat ici selon vos besoins
        console.log('Résultat de vérification numéro de série:', result);
        toast.success('Vérification numéro de série effectuée avec succès !');
      }
    } catch (error: any) {
      console.error('Erreur lors de la vérification:', error);
      
      // Gérer les erreurs d'authentification sans redirection
      if (error.response?.status === 401) {
        toast.error('Erreur d\'authentification. Veuillez vous reconnecter.');
        // Ne pas rediriger automatiquement, laisser l'utilisateur gérer
      } else if (error.response?.status === 403) {
        toast.error('Accès refusé. Vérifiez vos permissions.');
      } else if (error.response?.status === 429) {
        toast.error('Trop de requêtes. Veuillez réessayer plus tard.');
      } else {
        toast.error(error.response?.data?.message || 'Une erreur est survenue lors de la vérification.');
      }
    }
  };

  return (
    <div className="mt-8 bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
        <FileImage className="w-6 h-6 mr-3 text-emerald-400" />
        Vérification par capture d'écran
      </h3>
      
      <p className="text-white/80 mb-6">
        Téléchargez une capture d'écran de l'IMEI et du numéro de série pour une vérification automatique par IA.
      </p>
      
      <div className="space-y-6">
        {/* Upload zone */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-4">
            Capture d'écran <span className="text-red-400">*</span>
          </label>
          {uploadedFile ? (
            <div className="relative bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-4 group hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white/10">
                  <img 
                    src={uploadedFile.preview} 
                    alt="Capture d'écran" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">{uploadedFile.file.name}</p>
                  <p className="text-sm text-white/70">
                    {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  {/* Indicateur de validation IA */}
                  <IAValidationIndicator 
                    isAnalyzing={isIaValidating}
                    validationResult={iaValidation || undefined}
                    onRetry={() => validateWithIA(uploadedFile.file)}
                  />
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Affichage des données extraites */}
              {iaValidation?.extractedData && (
                <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <h4 className="text-sm font-semibold text-white/90 mb-2">Données extraites :</h4>
                  <div className="space-y-2 text-sm">
                    {iaValidation.extractedData.imei && (
                      <div className="flex justify-between">
                        <span className="text-white/70">IMEI :</span>
                        <span className="font-mono text-white">{iaValidation.extractedData.imei}</span>
                      </div>
                    )}
                    {iaValidation.extractedData.serialNumber && (
                      <div className="flex justify-between">
                        <span className="text-white/70">Numéro de série :</span>
                        <span className="font-mono text-white">{iaValidation.extractedData.serialNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* Affichage des erreurs IA */}
              {iaValidation && !iaValidation.isValid && (
                <div className="mt-3 p-3 bg-red-500/20 rounded-lg border border-red-500/30">
                  <p className="text-sm text-red-200 font-medium">Erreurs de validation :</p>
                  <ul className="mt-1 text-xs text-red-100">
                    {iaValidation.errors.map((error, index) => (
                      <li key={index} className="list-disc list-inside">• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="sr-only"
                id="screenshot-upload"
                ref={fileInputRef}
              />
              <label
                htmlFor="screenshot-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/30 rounded-2xl cursor-pointer bg-white/5 backdrop-blur-lg hover:bg-white/10 hover:border-emerald-400 transition-all duration-300 group"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-white/60 group-hover:text-emerald-400 transition-colors duration-300" />
                  <p className="mb-2 text-sm text-white/80 group-hover:text-white">
                    <span className="font-semibold">Cliquez pour télécharger</span> ou glisser-déposer
                  </p>
                  <p className="text-xs text-white/60">PNG, JPG jusqu'à 10MB</p>
                </div>
              </label>
            </div>
          )}
        </div>
        
        {/* Formulaire de saisie manuelle pour comparaison */}
        {iaValidation?.extractedData && (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h4 className="text-lg font-semibold text-white mb-4">Comparer avec les données saisies</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Saisie IMEI */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2 flex items-center">
                  <Smartphone className="w-4 h-4 mr-2 text-emerald-300" />
                  IMEI saisi
                </label>
                <input
                  type="text"
                  value={manualImei}
                  onChange={(e) => setManualImei(e.target.value.replace(/\D/g, '').slice(0, 15))}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 focus:outline-none transition-all duration-300 hover:bg-white/15"
                  placeholder="Entrez l'IMEI (15 chiffres)"
                  maxLength={15}
                />
              </div>
              
              {/* Saisie numéro de série */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2 flex items-center">
                  <Hash className="w-4 h-4 mr-2 text-emerald-300" />
                  Numéro de série saisi
                </label>
                <input
                  type="text"
                  value={manualSerial}
                  onChange={(e) => setManualSerial(e.target.value.replace(/[^A-Za-z0-9]/g, '').slice(0, 20).toUpperCase())}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 focus:outline-none transition-all duration-300 hover:bg-white/15"
                  placeholder="Entrez le numéro de série"
                  maxLength={20}
                />
              </div>
            </div>
            
            {/* Bouton de comparaison */}
            <button
              type="button"
              onClick={handleCompareData}
              disabled={!manualImei && !manualSerial}
              className={`mt-4 w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                (manualImei || manualSerial)
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-white/10 text-white/50 cursor-not-allowed'
              }`}
            >
              <Check className="w-5 h-5" />
              <span>Comparer les données</span>
            </button>
            
            {/* Résultat de la comparaison */}
            {comparisonResult && (
              <div className={`mt-4 p-4 rounded-xl border ${
                comparisonResult.isValid 
                  ? 'bg-emerald-500/20 border-emerald-500/30' 
                  : 'bg-red-500/20 border-red-500/30'
              }`}>
                <div className="flex items-center">
                  {comparisonResult.isValid ? (
                    <CheckCircle className="w-6 h-6 text-emerald-400 mr-2" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-400 mr-2" />
                  )}
                  <h5 className={`font-semibold ${
                    comparisonResult.isValid ? 'text-emerald-300' : 'text-red-300'
                  }`}>
                    {comparisonResult.isValid 
                      ? 'Données conformes' 
                      : 'Données non conformes'}
                  </h5>
                </div>
                
                {!comparisonResult.isValid && (
                  <ul className="mt-2 text-sm text-red-200">
                    {comparisonResult.errors.map((error, index) => (
                      <li key={index} className="list-disc list-inside">• {error}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={handleVerifyExtractedData}
            disabled={!iaValidation?.isValid || isIaValidating}
            className={`flex-1 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
              iaValidation?.isValid && !isIaValidating
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                : 'bg-white/10 text-white/50 cursor-not-allowed'
            }`}
          >
            {isIaValidating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Vérification en cours...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Vérifier les données extraites</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IAVerificationSection;