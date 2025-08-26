/**
 * Script de test pour vérifier que les redirections intempestives sont corrigées
 * 
 * Ce script teste les scénarios qui causaient précédemment des redirections vers la page de connexion
 */

import { iaAnalysisService } from '@/services/iaAnalysisService';
import { phoneService } from '@/services/api';

console.log('=== Test de vérification des redirections ===');

// Test 1: Vérifier que l'analyse IA ne cause pas de redirection
async function testIAAnalysisNoRedirect() {
  console.log('\n--- Test 1: Analyse IA sans redirection ---');
  
  try {
    // Créer une image de test simple
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
    
    // Convertir en blob et créer un fichier
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, 'image/png');
    });
    
    const testImage = new File([blob], 'test-image.png', { type: 'image/png' });
    
    // Essayer d'analyser l'image
    console.log('Tentative d\'analyse de l\'image de test...');
    const result = await iaAnalysisService.analyzeImage(testImage, 'imei');
    console.log('✅ Analyse IA réussie sans redirection');
    console.log('Résultat:', result);
    
    return true;
  } catch (error: any) {
    console.log('❌ Erreur lors de l\'analyse IA:', error.message);
    
    // Vérifier si c'est une erreur qui causerait une redirection
    if (error.message.includes('redirect') || error.message.includes('login')) {
      console.log('⚠️  Erreur susceptible de causer une redirection');
      return false;
    }
    
    console.log('✅ Erreur gérée sans redirection');
    return true;
  }
}

// Test 2: Vérifier que la vérification d'IMEI ne cause pas de redirection
async function testIMEIVerificationNoRedirect() {
  console.log('\n--- Test 2: Vérification IMEI sans redirection ---');
  
  try {
    console.log('Tentative de vérification d\'IMEI de test...');
    const result = await phoneService.verifyIMEI('123456789012345');
    console.log('✅ Vérification IMEI réussie sans redirection');
    console.log('Résultat:', result);
    
    return true;
  } catch (error: any) {
    console.log('❌ Erreur lors de la vérification IMEI:', error.message);
    
    // Vérifier si c'est une erreur qui causerait une redirection
    if (error.response?.status === 401) {
      console.log('⚠️  Erreur 401 susceptible de causer une redirection');
      return false;
    }
    
    console.log('✅ Erreur gérée sans redirection');
    return true;
  }
}

// Test 3: Vérifier l'état d'authentification
function testAuthState() {
  console.log('\n--- Test 3: État d\'authentification ---');
  
  const token = localStorage.getItem('auth_token');
  console.log('Token présent:', !!token);
  
  if (token) {
    console.log('Longueur du token:', token.length);
    console.log('✅ Authentification active');
    return true;
  } else {
    console.log('⚠️  Aucune authentification active');
    return false;
  }
}

// Fonction principale de test
async function runRedirectionTests() {
  console.log('Démarrage des tests de vérification des redirections...\n');
  
  const results = {
    iaAnalysis: await testIAAnalysisNoRedirect(),
    imeiVerification: await testIMEIVerificationNoRedirect(),
    authState: testAuthState()
  };
  
  console.log('\n=== Résultats des tests ===');
  console.log('Analyse IA sans redirection:', results.iaAnalysis ? '✅' : '❌');
  console.log('Vérification IMEI sans redirection:', results.imeiVerification ? '✅' : '❌');
  console.log('État d\'authentification:', results.authState ? '✅' : '⚠️');
  
  const allPassed = Object.values(results).every(result => result === true);
  console.log('\nRésultat global:', allPassed ? '✅ Tous les tests réussis' : '❌ Certains tests ont échoué');
  
  if (!allPassed) {
    console.log('\n⚠️  Si vous êtes redirigé vers la page de connexion, vérifiez :');
    console.log('1. Votre clé API OpenRouter dans le fichier .env');
    console.log('2. Votre token d\'authentification');
    console.log('3. Les erreurs 401 dans la console');
  }
  
  return allPassed;
}

// Exporter la fonction pour utilisation dans la console
(window as any).testRedirectionFix = runRedirectionTests;

export { runRedirectionTests };