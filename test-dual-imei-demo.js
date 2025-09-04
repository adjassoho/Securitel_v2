/**
 * Script de démonstration des fonctionnalités dual-IMEI
 * Ce script permet de tester la logique d'extraction et de validation dual-IMEI
 * 
 * Pour utiliser ce script:
 * 1. Ouvrez la console développeur (F12) sur la page de vérification
 * 2. Copiez et collez ce code dans la console
 * 3. Exécutez testDualImeiValidation() pour tester différents scénarios
 */

// Fonction de test pour simuler les différents cas de figure dual-IMEI
function testDualImeiValidation() {
  console.log('=== TEST DE VALIDATION DUAL-IMEI ===\n');
  
  // Cas de test 1: Utilisateur saisit 1 IMEI, IA en détecte 2
  console.log('Cas 1: Utilisateur saisit 1 IMEI, IA détecte 2 IMEI');
  const extractedData1 = {
    imei1: '123456789012345',
    imei2: '987654321098765',
    serialNumber: 'ABC123'
  };
  const userInput1 = {
    imei1: '123456789012345',
    imei2: '',
    serial_number: 'ABC123'
  };
  console.log('Données extraites:', extractedData1);
  console.log('Données utilisateur:', userInput1);
  console.log('Résultat attendu: Warning + Suggestion de saisir IMEI2\n');
  
  // Cas de test 2: Utilisateur saisit 2 IMEI, IA en détecte 2 (correspondance parfaite)
  console.log('Cas 2: Utilisateur saisit 2 IMEI, IA détecte 2 IMEI (correspondance)');
  const extractedData2 = {
    imei1: '123456789012345',
    imei2: '987654321098765',
    serialNumber: 'ABC123'
  };
  const userInput2 = {
    imei1: '123456789012345',
    imei2: '987654321098765',
    serial_number: 'ABC123'
  };
  console.log('Données extraites:', extractedData2);
  console.log('Données utilisateur:', userInput2);
  console.log('Résultat attendu: Validation réussie\n');
  
  // Cas de test 3: Utilisateur saisit 2 IMEI, IA en détecte 2 (inversés)
  console.log('Cas 3: Utilisateur saisit 2 IMEI, IA détecte 2 IMEI (inversés)');
  const extractedData3 = {
    imei1: '123456789012345',
    imei2: '987654321098765',
    serialNumber: 'ABC123'
  };
  const userInput3 = {
    imei1: '987654321098765',
    imei2: '123456789012345',
    serial_number: 'ABC123'
  };
  console.log('Données extraites:', extractedData3);
  console.log('Données utilisateur:', userInput3);
  console.log('Résultat attendu: Warning sur inversion + Suggestion\n');
  
  // Cas de test 4: Utilisateur saisit 1 IMEI (IMEI2), IA en détecte 2
  console.log('Cas 4: Utilisateur saisit IMEI2 uniquement, IA détecte 2 IMEI');
  const extractedData4 = {
    imei1: '123456789012345',
    imei2: '987654321098765',
    serialNumber: 'ABC123'
  };
  const userInput4 = {
    imei1: '',
    imei2: '987654321098765',
    serial_number: 'ABC123'
  };
  console.log('Données extraites:', extractedData4);
  console.log('Données utilisateur:', userInput4);
  console.log('Résultat attendu: Warning que l\'utilisateur a saisi IMEI2 + Suggestion de saisir IMEI1\n');
  
  // Cas de test 5: Téléphone single-SIM
  console.log('Cas 5: Téléphone single-SIM (1 IMEI détecté)');
  const extractedData5 = {
    imei1: '123456789012345',
    imei2: null,
    serialNumber: 'ABC123'
  };
  const userInput5 = {
    imei1: '123456789012345',
    imei2: '',
    serial_number: 'ABC123'
  };
  console.log('Données extraites:', extractedData5);
  console.log('Données utilisateur:', userInput5);
  console.log('Résultat attendu: Validation réussie (single-SIM)\n');
  
  console.log('=== FIN DES TESTS ===');
  console.log('Pour tester en conditions réelles, uploadez une capture d\'écran contenant des IMEI et utilisez le formulaire de comparaison.');
}

// Fonction pour créer une image de test avec des IMEI
function createTestImageWithDualImei() {
  console.log('Création d\'une image de test avec dual-IMEI...');
  
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');
  
  // Fond blanc
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 400, 300);
  
  // Titre
  ctx.fillStyle = '#000000';
  ctx.font = '16px Arial';
  ctx.fillText('Informations téléphone', 50, 40);
  
  // IMEI 1
  ctx.font = '14px Arial';
  ctx.fillText('IMEI 1 (SIM1): 123456789012345', 50, 80);
  
  // IMEI 2
  ctx.fillText('IMEI 2 (SIM2): 987654321098765', 50, 110);
  
  // Numéro de série
  ctx.fillText('Numéro de série: ABC123DEF456', 50, 140);
  
  // Informations supplémentaires
  ctx.font = '12px Arial';
  ctx.fillText('Modèle: Test Phone Dual-SIM', 50, 180);
  ctx.fillText('RAM: 8GB', 50, 200);
  ctx.fillText('Stockage: 128GB', 50, 220);
  
  // Convertir en blob
  canvas.toBlob((blob) => {
    console.log('Image de test créée!');
    console.log('Vous pouvez maintenant utiliser cette image pour tester l\'extraction dual-IMEI');
    
    // Créer un lien de téléchargement
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'test-dual-imei.png';
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}

// Messages informatifs
console.log('=== FONCTIONS DE TEST DUAL-IMEI DISPONIBLES ===');
console.log('1. testDualImeiValidation() - Teste les différents scénarios de validation');
console.log('2. createTestImageWithDualImei() - Crée une image de test avec 2 IMEI');
console.log('');
console.log('Exemple d\'utilisation:');
console.log('> testDualImeiValidation()');
console.log('> createTestImageWithDualImei()');