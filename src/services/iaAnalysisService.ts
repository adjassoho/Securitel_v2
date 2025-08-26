/*
 * Service d'analyse IA pour l'extraction d'informations depuis des images
 * 
 * Pour utiliser ce service, vous devez configurer la clé API OpenRouter dans votre fichier .env :
 * VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
 * 
 * Modèle utilisé : google/gemini-flash-1.5 (gratuit et adapté pour la reconnaissance d'images)
 * 
 * Vous pouvez obtenir une clé API gratuite sur https://openrouter.ai/
 */

import axios from 'axios';

// Configuration d'OpenRouter
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
// Utilisation du modèle gratuit google/gemini-flash-1.5
const OPENROUTER_MODEL = 'google/gemini-flash-1.5';

console.log('Valeur de VITE_OPENROUTER_API_KEY:', import.meta.env.VITE_OPENROUTER_API_KEY);
console.log('OPENROUTER_API_KEY (constante):', OPENROUTER_API_KEY);

interface ImageAnalysisResponse {
  extractedData: {
    imei?: string;
    serialNumber?: string;
    ram?: string;
    storage?: string;
  };
  confidence: number;
}

class IAAnalysisService {
  private apiKey: string;
  private apiUrl: string;
  private model: string;

  constructor() {
    this.apiKey = OPENROUTER_API_KEY || '';
    this.apiUrl = OPENROUTER_API_URL;
    this.model = OPENROUTER_MODEL;
    
    if (!this.apiKey) {
      console.warn('OpenRouter API key is not configured');
    }
  }

  /**
   * Convertit un fichier image en base64
   */
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  /**
   * Nettoie et extrait le JSON de la réponse du modèle
   */
  private extractJsonFromResponse(content: string): any {
    try {
      // Essayer de parser directement si c'est déjà du JSON
      return JSON.parse(content);
    } catch (parseError) {
      // Si le parsing échoue, essayer d'extraire le JSON de la réponse
      const jsonMatch = content.match(/\{[^{}]*\}/s);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (nestedError) {
          console.error('Impossible de parser le JSON extrait:', nestedError);
        }
      }
      
      // Si tout échoue, retourner un objet vide
      return {};
    }
  }

  /**
   * Nettoie les valeurs extraites (supprime les espaces, etc.)
   */
  private cleanExtractedValue(value: string | undefined): string | undefined {
    if (!value) return undefined;
    return value.trim().replace(/\s+/g, '');
  }

  /**
   * Analyse une image pour extraire les informations du téléphone
   */
  async analyzeImage(file: File, dataType: 'imei' | 'serial' | 'specs'): Promise<ImageAnalysisResponse> {
    try {
      console.log('Début de l\'analyse IA avec le modèle:', this.model);
      console.log('Clé API configurée:', !!this.apiKey);
      console.log('Longueur de la clé API:', this.apiKey?.length);
      
      // Vérifier si la clé API est configurée
      if (!this.apiKey) {
        console.error('Clé API OpenRouter non configurée');
        throw new Error('La clé API OpenRouter n\'est pas configurée. Veuillez vérifier votre fichier .env');
      }

      // Convertir l'image en base64
      const base64Image = await this.fileToBase64(file);
      console.log('Image convertie en base64, taille:', base64Image.length);
      
      // Déterminer le prompt selon le type de données à extraire
      let prompt = '';
      switch (dataType) {
        case 'imei':
          prompt = "Examinez cette capture d'écran et extrayez uniquement l'IMEI (15 chiffres) et le numéro de série. Répondez uniquement avec un JSON contenant les champs 'imei' et 'serialNumber'. Si vous ne trouvez pas d'IMEI, mettez 'imei' à null. Si vous ne trouvez pas de numéro de série, mettez 'serialNumber' à null. Exemple de format de réponse : {\"imei\": \"123456789012345\", \"serialNumber\": \"ABC123\"}";
          break;
        case 'serial':
          prompt = "Examinez cette capture d'écran et extrayez uniquement le numéro de série. Répondez uniquement avec un JSON contenant le champ 'serialNumber'. Si vous ne trouvez pas de numéro de série, mettez 'serialNumber' à null. Exemple de format de réponse : {\"serialNumber\": \"ABC123\"}";
          break;
        case 'specs':
          prompt = "Examinez cette capture d'écran et extrayez uniquement la RAM et le stockage. Répondez uniquement avec un JSON contenant les champs 'ram' et 'storage'. Si vous ne trouvez pas la RAM, mettez 'ram' à null. Si vous ne trouvez pas le stockage, mettez 'storage' à null. Exemple de format de réponse : {\"ram\": \"8GB\", \"storage\": \"128GB\"}";
          break;
      }

      console.log('Envoi de la requête à OpenRouter avec le modèle:', this.model);
      
      // Envoyer la requête à OpenRouter avec le modèle gratuit
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model, // Utilisation du modèle gratuit google/gemini-flash-1.5
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: prompt
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: base64Image
                  }
                }
              ]
            }
          ],
          temperature: 0.1,
          max_tokens: 300
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'SecuriTel'
          },
          // Ne pas suivre les redirections automatiquement
          maxRedirects: 0,
          // Timeout raisonnable
          timeout: 30000,
          // Ne pas lancer d'erreur pour les codes 401/403
          validateStatus: function (status) {
            console.log('Statut de réponse reçu:', status);
            return status < 500; // Résoudre uniquement si le status est inférieur à 500
          }
        }
      );

      console.log('Réponse reçue de OpenRouter:', response.status, response.data);
      
      // Vérifier le statut de la réponse
      if (response.status === 401) {
        console.error('Erreur 401: Clé API invalide');
        throw new Error('Clé API OpenRouter invalide. Veuillez vérifier votre configuration.');
      } else if (response.status === 403) {
        console.error('Erreur 403: Accès refusé');
        throw new Error('Accès refusé. Vérifiez les permissions de votre clé API.');
      } else if (response.status === 429) {
        console.error('Erreur 429: Quota dépassé');
        throw new Error('Quota OpenRouter dépassé. Veuillez réessayer plus tard.');
      } else if (response.status >= 500) {
        console.error('Erreur serveur:', response.status, response.statusText);
        throw new Error(`Erreur serveur OpenRouter: ${response.statusText}`);
      }

      // Extraire la réponse JSON du modèle
      const content = response.data.choices[0].message.content;
      console.log('Contenu de la réponse du modèle:', content);
      
      let extractedData = this.extractJsonFromResponse(content);
      console.log('Données extraites du JSON:', extractedData);
      
      // Nettoyer les valeurs extraites
      if (extractedData.imei) {
        extractedData.imei = this.cleanExtractedValue(extractedData.imei);
      }
      
      if (extractedData.serialNumber) {
        extractedData.serialNumber = this.cleanExtractedValue(extractedData.serialNumber);
      }
      
      if (extractedData.ram) {
        extractedData.ram = this.cleanExtractedValue(extractedData.ram);
      }
      
      if (extractedData.storage) {
        extractedData.storage = this.cleanExtractedValue(extractedData.storage);
      }

      console.log('Données extraites après nettoyage:', extractedData);
      
      return {
        extractedData,
        confidence: 0.7 // Confiance pour le modèle gratuit
      };
    } catch (error: any) {
      console.error('Erreur lors de l\'analyse de l\'image:', error);
      
      // Gérer les erreurs spécifiques
      if (error.response) {
        // Erreur de réponse HTTP
        console.error('Détails de l\'erreur de réponse:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
        
        if (error.response.status === 401) {
          throw new Error('Clé API OpenRouter invalide. Veuillez vérifier votre configuration et assurez-vous que la clé est active.');
        } else if (error.response.status === 403) {
          throw new Error('Accès refusé. Votre clé API gratuite ne permet pas d\'accéder à ce modèle. Utilisez le modèle gratuit google/gemini-flash-1.5.');
        } else if (error.response.status === 429) {
          throw new Error('Quota OpenRouter dépassé. Veuillez réessayer plus tard ou utiliser une clé avec un quota plus élevé.');
        } else if (error.response.status >= 500) {
          throw new Error(`Erreur serveur OpenRouter: ${error.response.statusText}. Veuillez réessayer plus tard.`);
        } else {
          throw new Error(`Erreur OpenRouter (${error.response.status}): ${error.response.statusText}`);
        }
      } else if (error.request) {
        // Erreur de requête (pas de réponse)
        console.error('Erreur de requête (pas de réponse):', error.request);
        throw new Error('Impossible de contacter OpenRouter. Vérifiez votre connexion internet et que l\'API est accessible.');
      } else {
        // Autre erreur
        console.error('Autre erreur:', error.message);
        throw new Error(error.message || 'Impossible d\'analyser l\'image pour le moment. Vérifiez votre configuration OpenRouter.');
      }
    }
  }

  /**
   * Compare les données extraites par IA avec les données saisies
   */
  validateExtractedData(
    extractedData: any,
    userInput: any,
    dataType: 'imei' | 'serial' | 'specs'
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    switch (dataType) {
      case 'imei':
        if (extractedData.imei && userInput.imei1) {
          // Nettoyer les valeurs pour la comparaison
          const cleanExtractedImei = this.cleanExtractedValue(extractedData.imei);
          const cleanUserImei = this.cleanExtractedValue(userInput.imei1);
          
          if (cleanExtractedImei !== cleanUserImei) {
            errors.push(`L'IMEI extrait (${cleanExtractedImei}) ne correspond pas à l'IMEI saisi (${cleanUserImei})`);
          }
        }
        
        if (extractedData.serialNumber && userInput.serial_number) {
          // Nettoyer les valeurs pour la comparaison
          const cleanExtractedSerial = this.cleanExtractedValue(extractedData.serialNumber);
          const cleanUserSerial = this.cleanExtractedValue(userInput.serial_number);
          
          if (cleanExtractedSerial !== cleanUserSerial) {
            errors.push(`Le numéro de série extrait (${cleanExtractedSerial}) ne correspond pas au numéro de série saisi (${cleanUserSerial})`);
          }
        }
        break;
        
      case 'serial':
        if (extractedData.serialNumber && userInput.serial_number) {
          // Nettoyer les valeurs pour la comparaison
          const cleanExtractedSerial = this.cleanExtractedValue(extractedData.serialNumber);
          const cleanUserSerial = this.cleanExtractedValue(userInput.serial_number);
          
          if (cleanExtractedSerial !== cleanUserSerial) {
            errors.push(`Le numéro de série extrait (${cleanExtractedSerial}) ne correspond pas au numéro de série saisi (${cleanUserSerial})`);
          }
        }
        break;
        
      case 'specs':
        if (extractedData.ram && userInput.ram) {
          // Nettoyer les valeurs pour la comparaison
          const cleanExtractedRam = this.cleanExtractedValue(extractedData.ram);
          const cleanUserRam = this.cleanExtractedValue(userInput.ram);
          
          if (cleanExtractedRam !== cleanUserRam) {
            errors.push(`La RAM extraite (${cleanExtractedRam}) ne correspond pas à la RAM saisie (${cleanUserRam})`);
          }
        }
        
        if (extractedData.storage && userInput.storage) {
          // Nettoyer les valeurs pour la comparaison
          const cleanExtractedStorage = this.cleanExtractedValue(extractedData.storage);
          const cleanUserStorage = this.cleanExtractedValue(userInput.storage);
          
          if (cleanExtractedStorage !== cleanUserStorage) {
            errors.push(`Le stockage extrait (${cleanExtractedStorage}) ne correspond pas au stockage saisi (${cleanUserStorage})`);
          }
        }
        break;
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export const iaAnalysisService = new IAAnalysisService();