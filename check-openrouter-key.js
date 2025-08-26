// Script de vérification de la clé API OpenRouter
// Exécutez avec : node check-openrouter-key.js

import axios from 'axios';

// Remplacez par votre nouvelle clé API
const API_KEY = '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';

async function checkOpenRouterKey() {
  try {
    console.log('🔍 Vérification de la clé API OpenRouter...');
    console.log('Clé utilisée:', API_KEY.substring(0, 20) + '...');
    
    // Test simple avec le modèle gratuit
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'google/gemini-flash-1.5',
        messages: [
          {
            role: 'user',
            content: 'Hello, this is a test message.'
          }
        ],
        max_tokens: 10
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'SecuriTel Test'
        },
        timeout: 10000
      }
    );

    console.log('✅ Clé API valide !');
    console.log('Statut:', response.status);
    console.log('Modèle utilisé:', response.data.model);
    console.log('Réponse:', response.data.choices[0].message.content);
    
  } catch (error) {
    console.error('❌ Erreur avec la clé API:');
    
    if (error.response) {
      console.error('Statut:', error.response.status);
      console.error('Message:', error.response.data?.error?.message || error.response.statusText);
      
      switch (error.response.status) {
        case 401:
          console.error('🔑 La clé API est invalide ou expirée');
          break;
        case 403:
          console.error('🚫 Accès refusé - vérifiez les permissions');
          break;
        case 429:
          console.error('⏰ Quota dépassé - attendez ou utilisez une autre clé');
          break;
        default:
          console.error('🔧 Erreur inconnue');
      }
    } else {
      console.error('🌐 Erreur de connexion:', error.message);
    }
  }
}

if (API_KEY === 'VOTRE_NOUVELLE_CLE_ICI') {
  console.error('❌ Veuillez remplacer VOTRE_NOUVELLE_CLE_ICI par votre vraie clé API');
} else {
  checkOpenRouterKey();
}