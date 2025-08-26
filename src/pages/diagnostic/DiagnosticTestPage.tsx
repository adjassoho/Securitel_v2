import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { phoneService } from '@/services/api';
import { iaAnalysisService } from '@/services/iaAnalysisService';
import { CheckCircle, AlertCircle, Play, Bug, RefreshCw } from 'lucide-react';

const DiagnosticTestPage = () => {
  const [testResults, setTestResults] = useState<Record<string, { status: 'pending' | 'success' | 'error'; message: string; details?: any }>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [redirectInfo, setRedirectInfo] = useState<{path: string; reason: string} | null>(null);
  const navigate = useNavigate();

  // Effet pour détecter les redirections et gérer les événements d'accès non autorisé
  useEffect(() => {
    const handleBeforeUnload = (_e: BeforeUnloadEvent) => {
      // Détecter si une redirection est sur le point de se produire
      console.log('Page sur le point d\'être déchargée');
    };
    
    // Gérer l'événement d'accès non autorisé
    const handleUnauthorizedAccess = () => {
      setRedirectInfo({
        path: '/login',
        reason: 'Accès non autorisé détecté'
      });
      console.log('Accès non autorisé détecté. Redirection vers la page de connexion...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unauthorized-access', handleUnauthorizedAccess);
    
    // Vérifier l'URL actuelle
    console.log('Page de diagnostic chargée, URL actuelle:', window.location.pathname);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unauthorized-access', handleUnauthorizedAccess);
    };
  }, [navigate]);

  // Test d'authentification
  const testAuthentication = async () => {
    setTestResults(prev => ({ ...prev, authentication: { status: 'pending', message: 'Vérification en cours...' } }));
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Aucun token d\'authentification trouvé');
      }
      
      // Tester un appel API simple
      const phones = await phoneService.getMyPhones();
      setTestResults(prev => ({ 
        ...prev, 
        authentication: { 
          status: 'success', 
          message: 'Authentification valide', 
          details: `Nombre de téléphones: ${phones.length}` 
        } 
      }));
    } catch (error: any) {
      setTestResults(prev => ({ 
        ...prev, 
        authentication: { 
          status: 'error', 
          message: 'Erreur d\'authentification', 
          details: error.message 
        } 
      }));
      
      // Si erreur 401, rediriger vers la connexion
      if (error.response?.status === 401) {
        setRedirectInfo({
          path: '/login',
          reason: 'Erreur 401 dans l\'authentification'
        });
        console.log('Redirection vers la page de connexion...');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    }
  };

  // Test de configuration OpenRouter
  const testOpenRouterConfig = async () => {
    setTestResults(prev => ({ ...prev, openrouter: { status: 'pending', message: 'Vérification en cours...' } }));
    
    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      if (!apiKey) {
        throw new Error('Clé API OpenRouter non configurée');
      }
      
      setTestResults(prev => ({ 
        ...prev, 
        openrouter: { 
          status: 'success', 
          message: 'Clé API configurée', 
          details: `Clé: ${apiKey.substring(0, 10)}...` 
        } 
      }));
    } catch (error: any) {
      setTestResults(prev => ({ 
        ...prev, 
        openrouter: { 
          status: 'error', 
          message: 'Erreur de configuration', 
          details: error.message 
        } 
      }));
    }
  };

  // Test de création d'image
  const createTestImage = (): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.fillText('IMEI: 123456789012345', 10, 30);
        ctx.fillText('S/N: ABC123XYZ', 10, 60);
      }
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'test-image.png', { type: 'image/png' });
          resolve(file);
        }
      }, 'image/png');
    });
  };

  // Test d'analyse IA
  const testIAAnalysis = async () => {
    setTestResults(prev => ({ ...prev, iaAnalysis: { status: 'pending', message: 'Analyse en cours...' } }));
    
    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      if (!apiKey) {
        throw new Error('Clé API OpenRouter non configurée');
      }
      
      const testImage = await createTestImage();
      console.log('Début de l\'analyse IA...');
      
      // Ajout de logs pour suivre l'exécution
      const startTime = Date.now();
      const result = await iaAnalysisService.analyzeImage(testImage, 'imei');
      const endTime = Date.now();
      
      console.log('Analyse IA terminée en', endTime - startTime, 'ms');
      console.log('Résultat de l\'analyse IA:', result);
      
      setTestResults(prev => ({ 
        ...prev, 
        iaAnalysis: { 
          status: 'success', 
          message: 'Analyse IA réussie', 
          details: JSON.stringify(result.extractedData) 
        } 
      }));
    } catch (error: any) {
      console.log('Erreur d\'analyse IA:', error);
      console.error('Erreur détaillée d\'analyse IA:', error);
      
      // Afficher plus d'informations sur l'erreur
      let errorMessage = error.message;
      if (error.response) {
        errorMessage += ` (Status: ${error.response.status})`;
      }
      
      setTestResults(prev => ({ 
        ...prev, 
        iaAnalysis: { 
          status: 'error', 
          message: 'Erreur d\'analyse IA', 
          details: errorMessage
        } 
      }));
      
      // Vérifier si l'erreur pourrait causer une redirection
      if (error.response?.status === 401) {
        setRedirectInfo({
          path: '/login',
          reason: 'Erreur 401 dans l\'analyse IA - vérifiez que l\'erreur ne provient pas de l\'API interne'
        });
      }
    }
  };

  // Test de vérification IMEI
  const testIMEIVerification = async () => {
    setTestResults(prev => ({ ...prev, imeiVerification: { status: 'pending', message: 'Vérification en cours...' } }));
    
    try {
      const result = await phoneService.verifyIMEI('123456789012345');
      setTestResults(prev => ({ 
        ...prev, 
        imeiVerification: { 
          status: 'success', 
          message: 'Vérification IMEI réussie', 
          details: JSON.stringify(result) 
        } 
      }));
    } catch (error: any) {
      setTestResults(prev => ({ 
        ...prev, 
        imeiVerification: { 
          status: 'error', 
          message: 'Erreur de vérification IMEI', 
          details: error.message 
        } 
      }));
      
      // Si erreur 401, rediriger vers la connexion
      if (error.response?.status === 401) {
        setRedirectInfo({
          path: '/login',
          reason: 'Erreur 401 dans la vérification IMEI'
        });
        console.log('Redirection vers la page de connexion...');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    }
  };

  // Test de détection de redirection
  const testRedirectionDetection = async () => {
    setTestResults(prev => ({ ...prev, redirection: { status: 'pending', message: 'Détection en cours...' } }));
    
    try {
      // Vérifier le token actuel
      const token = localStorage.getItem('auth_token');
      const currentPath = window.location.pathname;
      
      setTestResults(prev => ({ 
        ...prev, 
        redirection: { 
          status: 'success', 
          message: 'Aucune redirection détectée', 
          details: `Page actuelle: ${currentPath}, Token: ${!!token}` 
        } 
      }));
    } catch (error: any) {
      setTestResults(prev => ({ 
        ...prev, 
        redirection: { 
          status: 'error', 
          message: 'Erreur de détection', 
          details: error.message 
        } 
      }));
    }
  };

  // Exécuter tous les tests
  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults({});
    setRedirectInfo(null);
    
    await testAuthentication();
    await testOpenRouterConfig();
    await testIAAnalysis();
    await testIMEIVerification();
    await testRedirectionDetection();
    
    setIsRunning(false);
  };

  // Réinitialiser les tests
  const resetTests = () => {
    setTestResults({});
    setRedirectInfo(null);
  };

  // Obtenir l'icône appropriée pour le statut
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>;
      default:
        return null;
    }
  };

  // Obtenir la classe de couleur pour le statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'pending':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '4s'}}></div>
      </div>
      
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]"></div>
      
      <div className="relative min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête */}
          <div className="text-center mb-8">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full blur-lg opacity-75 animate-pulse"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-full p-6 border border-white/20 mx-auto w-20 h-20 flex items-center justify-center">
                <Bug className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
              Diagnostic du système
            </h1>
            <p className="text-lg lg:text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
              Outil de diagnostic pour identifier les problèmes de redirection
            </p>
          </div>

          {/* Panneau de contrôle */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Tests de diagnostic</h2>
                <p className="text-white/80">
                  Exécutez les tests pour identifier la cause du problème de redirection
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={resetTests}
                  disabled={isRunning}
                  className="px-4 py-4 rounded-2xl font-semibold transition-all duration-300 bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button
                  onClick={runAllTests}
                  disabled={isRunning}
                  className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    isRunning
                      ? 'bg-white/10 text-white/50 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Tests en cours...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      <span>Exécuter tous les tests</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Affichage des informations de redirection */}
            {redirectInfo && (
              <div className="mt-6 p-4 bg-amber-500/20 border border-amber-500/30 rounded-xl">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-amber-300 mr-2" />
                  <h3 className="font-semibold text-amber-100">Redirection détectée</h3>
                </div>
                <p className="mt-2 text-amber-200">
                  Redirection vers <span className="font-mono">{redirectInfo.path}</span> - {redirectInfo.reason}
                </p>
              </div>
            )}
          </div>

          {/* Résultats des tests */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Test d'authentification */}
            <div className={`rounded-2xl p-6 border-2 transition-all duration-300 ${
              testResults.authentication 
                ? getStatusColor(testResults.authentication.status)
                : 'bg-white/10 backdrop-blur-lg border-white/20 text-white'
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Authentification</h3>
                  {testResults.authentication ? (
                    <div>
                      <p className="font-medium">{testResults.authentication.message}</p>
                      {testResults.authentication.details && (
                        <p className="text-sm mt-2 opacity-80">{testResults.authentication.details}</p>
                      )}
                    </div>
                  ) : (
                    <p className="opacity-70">Test non exécuté</p>
                  )}
                </div>
                <div className="ml-4">
                  {testResults.authentication && getStatusIcon(testResults.authentication.status)}
                </div>
              </div>
              <button
                onClick={testAuthentication}
                disabled={isRunning}
                className="mt-4 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-300 text-sm font-medium"
              >
                Tester
              </button>
            </div>

            {/* Test OpenRouter */}
            <div className={`rounded-2xl p-6 border-2 transition-all duration-300 ${
              testResults.openrouter 
                ? getStatusColor(testResults.openrouter.status)
                : 'bg-white/10 backdrop-blur-lg border-white/20 text-white'
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Configuration OpenRouter</h3>
                  {testResults.openrouter ? (
                    <div>
                      <p className="font-medium">{testResults.openrouter.message}</p>
                      {testResults.openrouter.details && (
                        <p className="text-sm mt-2 opacity-80">{testResults.openrouter.details}</p>
                      )}
                    </div>
                  ) : (
                    <p className="opacity-70">Test non exécuté</p>
                  )}
                </div>
                <div className="ml-4">
                  {testResults.openrouter && getStatusIcon(testResults.openrouter.status)}
                </div>
              </div>
              <button
                onClick={testOpenRouterConfig}
                disabled={isRunning}
                className="mt-4 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-300 text-sm font-medium"
              >
                Tester
              </button>
            </div>

            {/* Test analyse IA */}
            <div className={`rounded-2xl p-6 border-2 transition-all duration-300 ${
              testResults.iaAnalysis 
                ? getStatusColor(testResults.iaAnalysis.status)
                : 'bg-white/10 backdrop-blur-lg border-white/20 text-white'
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Analyse IA</h3>
                  {testResults.iaAnalysis ? (
                    <div>
                      <p className="font-medium">{testResults.iaAnalysis.message}</p>
                      {testResults.iaAnalysis.details && (
                        <p className="text-sm mt-2 opacity-80 truncate max-w-xs">{testResults.iaAnalysis.details}</p>
                      )}
                    </div>
                  ) : (
                    <p className="opacity-70">Test non exécuté</p>
                  )}
                </div>
                <div className="ml-4">
                  {testResults.iaAnalysis && getStatusIcon(testResults.iaAnalysis.status)}
                </div>
              </div>
              <button
                onClick={testIAAnalysis}
                disabled={isRunning}
                className="mt-4 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-300 text-sm font-medium"
              >
                Tester
              </button>
            </div>

            {/* Test vérification IMEI */}
            <div className={`rounded-2xl p-6 border-2 transition-all duration-300 ${
              testResults.imeiVerification 
                ? getStatusColor(testResults.imeiVerification.status)
                : 'bg-white/10 backdrop-blur-lg border-white/20 text-white'
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Vérification IMEI</h3>
                  {testResults.imeiVerification ? (
                    <div>
                      <p className="font-medium">{testResults.imeiVerification.message}</p>
                      {testResults.imeiVerification.details && (
                        <p className="text-sm mt-2 opacity-80 truncate max-w-xs">{testResults.imeiVerification.details}</p>
                      )}
                    </div>
                  ) : (
                    <p className="opacity-70">Test non exécuté</p>
                  )}
                </div>
                <div className="ml-4">
                  {testResults.imeiVerification && getStatusIcon(testResults.imeiVerification.status)}
                </div>
              </div>
              <button
                onClick={testIMEIVerification}
                disabled={isRunning}
                className="mt-4 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-300 text-sm font-medium"
              >
                Tester
              </button>
            </div>

            {/* Test de détection de redirection */}
            <div className={`rounded-2xl p-6 border-2 transition-all duration-300 md:col-span-2 ${
              testResults.redirection 
                ? getStatusColor(testResults.redirection.status)
                : 'bg-white/10 backdrop-blur-lg border-white/20 text-white'
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Détection de redirection</h3>
                  {testResults.redirection ? (
                    <div>
                      <p className="font-medium">{testResults.redirection.message}</p>
                      {testResults.redirection.details && (
                        <p className="text-sm mt-2 opacity-80">{testResults.redirection.details}</p>
                      )}
                    </div>
                  ) : (
                    <p className="opacity-70">Test non exécuté</p>
                  )}
                </div>
                <div className="ml-4">
                  {testResults.redirection && getStatusIcon(testResults.redirection.status)}
                </div>
              </div>
              <button
                onClick={testRedirectionDetection}
                disabled={isRunning}
                className="mt-4 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-300 text-sm font-medium"
              >
                Tester
              </button>
            </div>
          </div>

          {/* Informations de débogage */}
          <div className="mt-8 bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">Informations de débogage</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-white/90 mb-2">Variables d'environnement</h3>
                <div className="bg-white/5 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/70">VITE_API_URL:</span>
                    <span className="font-mono text-sm text-white">{import.meta.env.VITE_API_URL || 'Non défini'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">VITE_OPENROUTER_API_KEY:</span>
                    <span className="font-mono text-sm text-white">
                      {import.meta.env.VITE_OPENROUTER_API_KEY 
                        ? `${import.meta.env.VITE_OPENROUTER_API_KEY.substring(0, 10)}...` 
                        : 'Non défini'}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-white/90 mb-2">État d'authentification</h3>
                <div className="bg-white/5 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/70">Token présent:</span>
                    <span className="text-white">{localStorage.getItem('auth_token') ? 'Oui' : 'Non'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Longueur du token:</span>
                    <span className="font-mono text-sm text-white">
                      {localStorage.getItem('auth_token')?.length || 0} caractères
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Page actuelle:</span>
                    <span className="font-mono text-sm text-white">
                      {window.location.pathname}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl">
              <h3 className="font-semibold text-blue-100 mb-2">Instructions de débogage</h3>
              <ul className="text-blue-200 text-sm space-y-1">
                <li>1. Ouvrez la console du navigateur (F12) pour voir les logs détaillés</li>
                <li>2. Exécutez les tests un par un pour identifier le problème</li>
                <li>3. Si vous êtes redirigé, vérifiez les erreurs 401 dans la console</li>
                <li>4. Vérifiez que votre clé API OpenRouter est correctement configurée</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticTestPage;
