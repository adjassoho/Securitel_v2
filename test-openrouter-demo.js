// Test avec différentes approches pour OpenRouter
async function testOpenRouterMethods() {
  console.log('🔍 Test des différentes méthodes OpenRouter...\n');

  // Méthode 1: Test avec l'endpoint de modèles (ne nécessite pas de clé)
  try {
    console.log('1️⃣ Test de l\'endpoint des modèles (sans clé)...');
    const modelsResponse = await fetch('https://openrouter.ai/api/v1/models');
    
    if (modelsResponse.ok) {
      const models = await modelsResponse.json();
      console.log('✅ Endpoint des modèles accessible');
      console.log('Nombre de modèles disponibles:', models.data?.length || 0);
      
      // Chercher le modèle gratuit
      const freeModel = models.data?.find(m => m.id === 'google/gemini-flash-1.5');
      if (freeModel) {
        console.log('✅ Modèle gratuit google/gemini-flash-1.5 trouvé');
        console.log('Prix:', freeModel.pricing);
      }
    } else {
      console.log('❌ Endpoint des modèles inaccessible');
    }
  } catch (error) {
    console.error('❌ Erreur lors du test des modèles:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Méthode 2: Test avec une clé de démonstration OpenRouter
  try {
    console.log('2️⃣ Test avec clé de démonstration...');
    
    // Utilisons la clé de démonstration officielle d'OpenRouter (si elle existe)
    const demoKeys = [
      'sk-or-v1-demo-key-for-testing-purposes-only-not-for-production-use',
      'sk-or-v1-test-key-please-replace-with-your-own-api-key-from-openrouter'
    ];

    for (const demoKey of demoKeys) {
      console.log(`Essai avec clé: ${demoKey.substring(0, 20)}...`);
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${demoKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'SecuriTel Demo Test'
        },
        body: JSON.stringify({
          model: 'google/gemini-flash-1.5',
          messages: [{ role: 'user', content: 'Hello' }],
          max_tokens: 5
        })
      });

      console.log(`Statut: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Clé de démonstration fonctionnelle !');
        console.log('Réponse:', data.choices[0].message.content);
        return demoKey; // Retourner la clé qui fonctionne
      } else {
        const errorData = await response.text();
        console.log(`❌ Clé non fonctionnelle: ${response.statusText}`);
      }
    }
  } catch (error) {
    console.error('❌ Erreur lors du test des clés de démonstration:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Méthode 3: Instructions pour créer une nouvelle clé
  console.log('3️⃣ Instructions pour créer une nouvelle clé:');
  console.log('');
  console.log('1. Allez sur: https://openrouter.ai/');
  console.log('2. Créez un compte ou connectez-vous');
  console.log('3. Allez dans: https://openrouter.ai/keys');
  console.log('4. Cliquez sur "Create Key"');
  console.log('5. Copiez la clé générée');
  console.log('6. Remplacez la clé dans votre fichier .env');
  console.log('');
  console.log('💡 Astuce: Les comptes gratuits ont un quota limité mais suffisant pour tester');

  return null;
}

// Exécuter le test
testOpenRouterMethods().then(workingKey => {
  if (workingKey) {
    console.log('\n🎉 Clé fonctionnelle trouvée:', workingKey.substring(0, 20) + '...');
  } else {
    console.log('\n❌ Aucune clé de démonstration ne fonctionne. Vous devez créer votre propre clé.');
  }
});