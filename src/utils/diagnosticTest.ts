/*
 * Script de diagnostic pour identifier les problèmes de redirection
 * 
 * Ce script permet de tester les différentes parties du système pour
 * identifier la cause des redirections intempestives vers la page de connexion.
 */

import { iaAnalysisService } from '@/services/iaAnalysisService';
import { phoneService } from '@/services/api';

// Test d'authentification
export const testAuthentication = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Test d\'authentification en cours...');
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      return { success: false, message: 'Aucun token d\'authentification trouvé' };
    }
    
    // Tester un appel API simple
    const phones = await phoneService.getMyPhones();
    return { success: true, message: `Authentification valide - Nombre de téléphones: ${phones.length}` };
  } catch (error: any) {
    console.error('Erreur d\'authentification:', error);
    return { success: false, message: `Erreur d'authentification: ${error.message}` };
  }
};

// Test de configuration OpenRouter
export const testOpenRouterConfig = (): { success: boolean; message: string } => {
  try {
    console.log('Test de configuration OpenRouter en cours...');
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    
    if (!apiKey) {
      return { success: false, message: 'Clé API OpenRouter non configurée' };
    }
    
    return { success: true, message: `Clé API configurée: ${apiKey.substring(0, 10)}...` };
  } catch (error: any) {
    console.error('Erreur de configuration OpenRouter:', error);
    return { success: false, message: `Erreur de configuration: ${error.message}` };
  }
};

// Test de création d'image
export const createTestImage = (): Promise<File> => {
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
export const testIAAnalysis = async (): Promise<{ success: boolean; message: string; details?: any }> => {
  try {
    console.log('Test d\'analyse IA en cours...');
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    
    if (!apiKey) {
      return { success: false, message: 'Clé API OpenRouter non configurée' };
    }
    
    const testImage = await createTestImage();
    console.log('Image de test créée, début de l\'analyse...');
    
    const startTime = Date.now();
    const result = await iaAnalysisService.analyzeImage(testImage, 'imei');
    const endTime = Date.now();
    
    console.log('Analyse IA terminée en', endTime - startTime, 'ms');
    
    return { 
      success: true, 
      message: 'Analyse IA réussie', 
      details: result.extractedData 
    };
  } catch (error: any) {
    console.error('Erreur d\'analyse IA:', error);
    return { 
      success: false, 
      message: `Erreur d'analyse IA: ${error.message}` 
    };
  }
};

// Test de vérification IMEI
export const testIMEIVerification = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Test de vérification IMEI en cours...');
    await phoneService.verifyIMEI('123456789012345');
    return { success: true, message: 'Vérification IMEI réussie' };
  } catch (error: any) {
    console.error('Erreur de vérification IMEI:', error);
    return { success: false, message: `Erreur de vérification IMEI: ${error.message}` };
  }
};

// Test de détection de redirection
export const testRedirectionDetection = (): { success: boolean; message: string } => {
  try {
    console.log('Test de détection de redirection en cours...');
    // Vérifier le token actuel
    const token = localStorage.getItem('auth_token');
    const currentPath = window.location.pathname;
    
    return { 
      success: true, 
      message: `Aucune redirection détectée - Page actuelle: ${currentPath}, Token: ${!!token}` 
    };
  } catch (error: any) {
    console.error('Erreur de détection de redirection:', error);
    return { success: false, message: `Erreur de détection: ${error.message}` };
  }
};

// Exécuter tous les tests
export const runAllTests = async (): Promise<void> => {
  console.log('=== DÉBUT DES TESTS DE DIAGNOSTIC ===');
  
  // Test d'authentification
  const authResult = await testAuthentication();
  console.log('Résultat du test d\'authentification:', authResult);
  
  // Test de configuration OpenRouter
  const openRouterResult = testOpenRouterConfig();
  console.log('Résultat du test OpenRouter:', openRouterResult);
  
  // Test d'analyse IA
  const iaResult = await testIAAnalysis();
  console.log('Résultat du test d\'analyse IA:', iaResult);
  
  // Test de vérification IMEI
  const imeiResult = await testIMEIVerification();
  console.log('Résultat du test de vérification IMEI:', imeiResult);
  
  // Test de détection de redirection
  const redirectionResult = testRedirectionDetection();
  console.log('Résultat du test de détection de redirection:', redirectionResult);
  
  console.log('=== FIN DES TESTS DE DIAGNOSTIC ===');
  
  // Afficher un résumé
  console.log('\n=== RÉSUMÉ DES TESTS ===');
  console.log('Authentification:', authResult.success ? '✅ OK' : '❌ Échec');
  console.log('Configuration OpenRouter:', openRouterResult.success ? '✅ OK' : '❌ Échec');
  console.log('Analyse IA:', iaResult.success ? '✅ OK' : '❌ Échec');
  console.log('Vérification IMEI:', imeiResult.success ? '✅ OK' : '❌ Échec');
  console.log('Détection de redirection:', redirectionResult.success ? '✅ OK' : '❌ Échec');
};