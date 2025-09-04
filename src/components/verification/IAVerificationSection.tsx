import { useState, useRef } from 'react';
import { phoneService } from '@/services/api';
import { Upload, Check, AlertCircle, X, FileImage, Search, Loader2, Smartphone, Hash, CheckCircle, Info, Lightbulb } from 'lucide-react';
import { useIAValidation } from '@/hooks/useIAValidation';
import { IAValidationResult } from '@/types';
import IAValidationIndicator from '@/components/ui/IAValidationIndicator';
import toast from 'react-hot-toast';

interface UploadedFile {
  file: File;
  preview: string;
}

interface ComparisonResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
  suggestions?: string[];
}

const IAVerificationSection = () => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [iaValidation, setIaValidation] = useState<IAValidationResult | null>(null);
  const [isIaValidating, setIsIaValidating] = useState(false);
  const [manualImei1, setManualImei1] = useState('');
  const [manualImei2, setManualImei2] = useState('');
  const [manualSerial, setManualSerial] = useState('');
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { validateImage } = useIAValidation();

  const handleFileUpload = (file: File) => {
    if (file) {
      const preview = URL.createObjectURL(file);
      setUploadedFile({ file, preview });
      
      // Réinitialiser les états
      setIaValidation(null);
      setComparisonResult(null);
      setManualImei1('');
      setManualImei2('');
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
    setManualImei1('');
    setManualImei2('');
    setManualSerial('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateWithIA = async (file: File) => {
    console.log('Début de la validation IA avec le fichier:', file.name);
    setIsIaValidating(true);
    
    try {
      // Préparer les données utilisateur avec les deux IMEI
      const userInput = {
        imei1: manualImei1,
        imei2: manualImei2,
        serial_number: manualSerial
      };
      
      // Analyser l'image avec l'IA pour extraire IMEI et numéro de série
      const result = await validateImage(file, 'imei', userInput);
      console.log('Résultat de la validation IA:', result);
      
      setIaValidation(result);
      
      if (result.isValid && result.extractedData) {
        toast.success('Vérification IA réussie !');
      } else if (!result.isValid) {
        // Les messages d'erreur, warnings et suggestions sont déjà affichés par le hook
        console.log('Vérification IA avec erreurs/avertissements');
      }
    } catch (error: any) {
      console.error('Erreur lors de la validation IA:', error);
      const errorMessage = error.message || 'Une erreur est survenue lors de la vérification IA.';
      toast.error(errorMessage);
      
      // Créer un résultat d'erreur pour l'affichage
      setIaValidation({
        isValid: false,
        errors: [errorMessage],
        warnings: [],
        suggestions: [],
        extractedData: {},
        imeiCount: 0,
        userImeiCount: 0
      });
    } finally {
      setIsIaValidating(false);
    }
  };

  const handleCompareData = () => {
    if (!iaValidation?.extractedData) return;
    
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
    
    // Comparer les IMEI
    const extractedImei1 = iaValidation.extractedData.imei1;
    const extractedImei2 = iaValidation.extractedData.imei2;
    const userImei1 = manualImei1.replace(/\s+/g, '');
    const userImei2 = manualImei2.replace(/\s+/g, '');
    
    const extractedCount = (extractedImei1 ? 1 : 0) + (extractedImei2 ? 1 : 0);
    const userCount = (userImei1 ? 1 : 0) + (userImei2 ? 1 : 0);
    
    console.log('Comparaison des données:', {
      extractedImei1,
      extractedImei2,
      userImei1,
      userImei2,
      extractedCount,
      userCount
    });
    
    if (userCount === 0) {
      errors.push('Veuillez saisir au moins un IMEI pour effectuer la comparaison.');
    } else {
      // Logique de comparaison dual-IMEI
      if (userCount === 1 && extractedCount > 1) {
        const userImei = userImei1 || userImei2;
        if (userImei === extractedImei1) {
          warnings.push(`Vous avez saisi l'IMEI1: ${userImei}`);
          suggestions.push(`L'IA a détecté un second IMEI (IMEI2: ${extractedImei2}). Veuillez saisir l'IMEI2 pour une validation complète.`);
        } else if (userImei === extractedImei2) {
          warnings.push(`Vous avez saisi l'IMEI2: ${userImei}`);
          suggestions.push(`L'IA a détecté un premier IMEI (IMEI1: ${extractedImei1}). Veuillez saisir l'IMEI1 pour une validation complète.`);
        } else {
          errors.push(`L'IMEI saisi (${userImei}) ne correspond à aucun des IMEI extraits.`);
        }
      } else if (userCount > 1 && extractedCount > 1) {
        // Comparaison directe
        if (userImei1 && extractedImei1 && userImei1 !== extractedImei1) {
          errors.push(`L'IMEI1 saisi (${userImei1}) ne correspond pas à l'IMEI1 extrait (${extractedImei1})`);
        }
        if (userImei2 && extractedImei2 && userImei2 !== extractedImei2) {
          errors.push(`L'IMEI2 saisi (${userImei2}) ne correspond pas à l'IMEI2 extrait (${extractedImei2})`);
        }
        
        // Vérifier si les IMEI sont inversés
        if (userImei1 === extractedImei2 && userImei2 === extractedImei1) {
          warnings.push('Les IMEI semblent être inversés.');
          suggestions.push('Vérifiez l\'ordre des IMEI sur votre appareil.');
        }
      } else if (userCount === 1 && extractedCount === 1) {
        const userImei = userImei1 || userImei2;
        const extractedImei = extractedImei1 || extractedImei2;
        
        if (userImei !== extractedImei) {
          errors.push(`L'IMEI saisi (${userImei}) ne correspond pas à l'IMEI extrait (${extractedImei})`);
        }
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
    
    setComparisonResult({ isValid, errors, warnings, suggestions });
    
    if (isValid) {
      toast.success('Les données saisies correspondent aux données extraites !');
    } else {
      toast.error('Les données saisies ne correspondent pas aux données extraites.');
    }
    
    // Afficher les warnings et suggestions
    warnings.forEach(warning => {
      toast(warning, { icon: '⚠️', duration: 5000 });
    });
    
    suggestions.forEach(suggestion => {
      toast(suggestion, { 
        icon: '💡', 
        duration: 8000,
        style: {
          background: '#3b82f6',
          color: 'white'
        }
      });
    });
  };

  const handleVerifyExtractedData = async () => {
    if (!iaValidation?.extractedData) return;
    
    try {
      let verificationResults = [];
      
      // Vérifier l'IMEI1 extrait
      if (iaValidation.extractedData.imei1) {
        try {
          const result = await phoneService.verifyIMEI(iaValidation.extractedData.imei1);
          verificationResults.push(`IMEI1 (${iaValidation.extractedData.imei1}): Vérification réussie`);
          console.log('Résultat de vérification IMEI1:', result);
        } catch (error: any) {
          verificationResults.push(`IMEI1 (${iaValidation.extractedData.imei1}): ${error.response?.data?.message || 'Erreur de vérification'}`);
        }
      }
      
      // Vérifier l'IMEI2 extrait
      if (iaValidation.extractedData.imei2) {
        try {
          const result = await phoneService.verifyIMEI(iaValidation.extractedData.imei2);
          verificationResults.push(`IMEI2 (${iaValidation.extractedData.imei2}): Vérification réussie`);
          console.log('Résultat de vérification IMEI2:', result);
        } catch (error: any) {
          verificationResults.push(`IMEI2 (${iaValidation.extractedData.imei2}): ${error.response?.data?.message || 'Erreur de vérification'}`);
        }
      }
      
      // Vérifier le numéro de série extrait
      if (iaValidation.extractedData.serialNumber) {
        try {
          const result = await phoneService.verifySerial(iaValidation.extractedData.serialNumber);
          verificationResults.push(`Numéro de série (${iaValidation.extractedData.serialNumber}): Vérification réussie`);
          console.log('Résultat de vérification numéro de série:', result);
        } catch (error: any) {
          verificationResults.push(`Numéro de série (${iaValidation.extractedData.serialNumber}): ${error.response?.data?.message || 'Erreur de vérification'}`);
        }
      }
      
      // Afficher le résumé des vérifications
      if (verificationResults.length > 0) {
        toast.success(
          `Vérifications effectuées: ${verificationResults.length} élément(s)`,
          { duration: 6000 }
        );
        
        // Afficher chaque résultat individuellement
        verificationResults.forEach((result, index) => {
          setTimeout(() => {
            toast(result, { 
              icon: result.includes('réussie') ? '✓' : '⚠️',
              duration: 8000,
              style: {
                background: result.includes('réussie') ? '#059669' : '#d97706',
                color: 'white'
              }
            });
          }, index * 1000);
        });
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
                  <h4 className="text-sm font-semibold text-white/90 mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" />
                    Données extraites :
                  </h4>
                  <div className="space-y-2 text-sm">
                    {iaValidation.extractedData.imei1 && (
                      <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                        <span className="text-white/70 flex items-center">
                          <Smartphone className="w-3 h-3 mr-1" />
                          IMEI 1 (SIM1) :
                        </span>
                        <span className="font-mono text-white bg-emerald-500/20 px-2 py-1 rounded">
                          {iaValidation.extractedData.imei1}
                        </span>
                      </div>
                    )}
                    {iaValidation.extractedData.imei2 && (
                      <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                        <span className="text-white/70 flex items-center">
                          <Smartphone className="w-3 h-3 mr-1" />
                          IMEI 2 (SIM2) :
                        </span>
                        <span className="font-mono text-white bg-emerald-500/20 px-2 py-1 rounded">
                          {iaValidation.extractedData.imei2}
                        </span>
                      </div>
                    )}
                    {iaValidation.extractedData.serialNumber && (
                      <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                        <span className="text-white/70 flex items-center">
                          <Hash className="w-3 h-3 mr-1" />
                          Numéro de série :
                        </span>
                        <span className="font-mono text-white bg-blue-500/20 px-2 py-1 rounded">
                          {iaValidation.extractedData.serialNumber}
                        </span>
                      </div>
                    )}
                    
                    {/* Informations sur la détection */}
                    <div className="mt-3 pt-2 border-t border-white/10">
                      <div className="flex items-center justify-between text-xs text-white/60">
                        <span>IMEI détectés: {iaValidation.imeiCount}</span>
                        <span>Type: {iaValidation.imeiCount > 1 ? 'Dual-SIM' : 'Single-SIM'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Affichage des erreurs, warnings et suggestions IA */}
              {iaValidation && (
                <div className="mt-3 space-y-2">
                  {/* Erreurs */}
                  {iaValidation.errors.length > 0 && (
                    <div className="p-3 bg-red-500/20 rounded-lg border border-red-500/30">
                      <p className="text-sm text-red-200 font-medium flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Erreurs de validation :
                      </p>
                      <ul className="mt-1 text-xs text-red-100 space-y-1">
                        {iaValidation.errors.map((error, index) => (
                          <li key={index} className="list-disc list-inside ml-4">• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Warnings */}
                  {iaValidation.warnings && iaValidation.warnings.length > 0 && (
                    <div className="p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                      <p className="text-sm text-yellow-200 font-medium flex items-center">
                        <Info className="w-4 h-4 mr-2" />
                        Informations :
                      </p>
                      <ul className="mt-1 text-xs text-yellow-100 space-y-1">
                        {iaValidation.warnings.map((warning, index) => (
                          <li key={index} className="list-disc list-inside ml-4">• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Suggestions */}
                  {iaValidation.suggestions && iaValidation.suggestions.length > 0 && (
                    <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                      <p className="text-sm text-blue-200 font-medium flex items-center">
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Suggestions :
                      </p>
                      <ul className="mt-1 text-xs text-blue-100 space-y-1">
                        {iaValidation.suggestions.map((suggestion, index) => (
                          <li key={index} className="list-disc list-inside ml-4">• {suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
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
            
            <div className="grid grid-cols-1 gap-4">
              {/* Section IMEI */}
              <div className="space-y-4">
                <h5 className="text-sm font-medium text-white/90 flex items-center">
                  <Smartphone className="w-4 h-4 mr-2 text-emerald-300" />
                  IMEI du téléphone
                  {iaValidation.imeiCount > 1 && (
                    <span className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                      Dual-SIM détecté
                    </span>
                  )}
                </h5>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* IMEI 1 */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      IMEI 1 (SIM1) 
                      {iaValidation.extractedData.imei1 && (
                        <span className="text-emerald-400 text-xs ml-1">✓ Détecté</span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={manualImei1}
                      onChange={(e) => setManualImei1(e.target.value.replace(/\D/g, '').slice(0, 15))}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 focus:outline-none transition-all duration-300 hover:bg-white/15"
                      placeholder="Entrez l'IMEI1 (15 chiffres)"
                      maxLength={15}
                    />
                    {manualImei1 && manualImei1.length < 15 && (
                      <p className="text-xs text-yellow-400 mt-1">
                        {15 - manualImei1.length} chiffres manquants
                      </p>
                    )}
                  </div>
                  
                  {/* IMEI 2 */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      IMEI 2 (SIM2) 
                      <span className="text-white/60 text-xs">(optionnel)</span>
                      {iaValidation.extractedData.imei2 && (
                        <span className="text-emerald-400 text-xs ml-1">✓ Détecté</span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={manualImei2}
                      onChange={(e) => setManualImei2(e.target.value.replace(/\D/g, '').slice(0, 15))}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 focus:outline-none transition-all duration-300 hover:bg-white/15"
                      placeholder="Entrez l'IMEI2 (15 chiffres)"
                      maxLength={15}
                    />
                    {manualImei2 && manualImei2.length < 15 && (
                      <p className="text-xs text-yellow-400 mt-1">
                        {15 - manualImei2.length} chiffres manquants
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Indicateur de correspondance IMEI */}
                {(manualImei1 || manualImei2) && iaValidation.extractedData && (
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-xs text-white/70 mb-2">Correspondances :</p>
                    <div className="space-y-1 text-xs">
                      {manualImei1 && (
                        <div className="flex items-center justify-between">
                          <span>IMEI1 saisi :</span>
                          <span className={`font-mono px-2 py-1 rounded ${
                            iaValidation.extractedData.imei1 === manualImei1 
                              ? 'bg-emerald-500/20 text-emerald-300' 
                              : 'bg-red-500/20 text-red-300'
                          }`}>
                            {manualImei1} {iaValidation.extractedData.imei1 === manualImei1 ? '✓' : '✗'}
                          </span>
                        </div>
                      )}
                      {manualImei2 && (
                        <div className="flex items-center justify-between">
                          <span>IMEI2 saisi :</span>
                          <span className={`font-mono px-2 py-1 rounded ${
                            iaValidation.extractedData.imei2 === manualImei2 
                              ? 'bg-emerald-500/20 text-emerald-300' 
                              : 'bg-red-500/20 text-red-300'
                          }`}>
                            {manualImei2} {iaValidation.extractedData.imei2 === manualImei2 ? '✓' : '✗'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Saisie numéro de série */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2 flex items-center">
                  <Hash className="w-4 h-4 mr-2 text-emerald-300" />
                  Numéro de série saisi
                  {iaValidation.extractedData.serialNumber && (
                    <span className="text-emerald-400 text-xs ml-2">✓ Détecté</span>
                  )}
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
              disabled={!manualImei1 && !manualImei2 && !manualSerial}
              className={`mt-4 w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                (manualImei1 || manualImei2 || manualSerial)
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-white/10 text-white/50 cursor-not-allowed'
              }`}
            >
              <Check className="w-5 h-5" />
              <span>Comparer les données</span>
            </button>
            
            {/* Résultat de la comparaison */}
            {comparisonResult && (
              <div className="mt-4 space-y-3">
                {/* Statut principal */}
                <div className={`p-4 rounded-xl border ${
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
                  
                  {/* Erreurs */}
                  {comparisonResult.errors && comparisonResult.errors.length > 0 && (
                    <ul className="mt-2 text-sm text-red-200 space-y-1">
                      {comparisonResult.errors.map((error, index) => (
                        <li key={index} className="list-disc list-inside ml-4">• {error}</li>
                      ))}
                    </ul>
                  )}
                </div>
                
                {/* Warnings */}
                {comparisonResult.warnings && comparisonResult.warnings.length > 0 && (
                  <div className="p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                    <p className="text-sm text-yellow-200 font-medium flex items-center">
                      <Info className="w-4 h-4 mr-2" />
                      Informations :
                    </p>
                    <ul className="mt-1 text-xs text-yellow-100 space-y-1">
                      {comparisonResult.warnings.map((warning, index) => (
                        <li key={index} className="list-disc list-inside ml-4">• {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Suggestions */}
                {comparisonResult.suggestions && comparisonResult.suggestions.length > 0 && (
                  <div className="p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                    <p className="text-sm text-blue-200 font-medium flex items-center">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Suggestions :
                    </p>
                    <ul className="mt-1 text-xs text-blue-100 space-y-1">
                      {comparisonResult.suggestions.map((suggestion, index) => (
                        <li key={index} className="list-disc list-inside ml-4">• {suggestion}</li>
                      ))}
                    </ul>
                  </div>
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
            disabled={!iaValidation?.extractedData || isIaValidating || 
                     (!iaValidation.extractedData.imei1 && !iaValidation.extractedData.imei2)}
            className={`flex-1 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
              iaValidation?.extractedData && 
              (iaValidation.extractedData.imei1 || iaValidation.extractedData.imei2) && 
              !isIaValidating
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
                <span>
                  Vérifier les données extraites
                  {iaValidation?.imeiCount && iaValidation.imeiCount > 0 && (
                    <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs">
                      {iaValidation.imeiCount} IMEI
                    </span>
                  )}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IAVerificationSection;