// Test simple de l'API OpenRouter avec fetch natif
const API_KEY = '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';

async function testAPI() {
  try {
    console.log('🔍 Test simple de l\'API OpenRouter...');
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'SecuriTel Test'
      },
      body: JSON.stringify({
        model: 'google/gemini-flash-1.5',
        messages: [
          {
            role: 'user',
            content: 'Test simple'
          }
        ],
        max_tokens: 10
      })
    });

    console.log('Statut de la réponse:', response.status);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Erreur:', response.status, response.statusText);
      console.error('Détails:', errorData);
      return;
    }

    const data = await response.json();
    console.log('✅ Succès !');
    console.log('Réponse:', data.choices[0].message.content);
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
  }
}

testAPI();