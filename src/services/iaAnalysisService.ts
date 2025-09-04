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

// Service d'analyse IA utilisant OpenRouter

// Configuration d'OpenRouter
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
// Utilisation du modèle gratuit google/gemini-flash-1.5
const OPENROUTER_MODEL = 'google/gemini-flash-1.5';

// Service d'analyse IA opérationnel

interface ImageAnalysisResponse {
  extractedData: {
    imei1?: string;
    imei2?: string;
    serialNumber?: string;
    ram?: string;
    storage?: string;
  };
  confidence: number;
  imeiCount: number;
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
      // Analyse IA en cours
      
      // Vérifier si la clé API est configurée
      if (!this.apiKey) {
        console.error('Clé API OpenRouter non configurée');
        throw new Error('La clé API OpenRouter n\'est pas configurée. Veuillez vérifier votre fichier .env');
      }

      // Convertir l'image en base64
      const base64Image = await this.fileToBase64(file);
      // Image convertie en base64
      
      // Déterminer le prompt selon le type de données à extraire
      let prompt = '';
      switch (dataType) {
        case 'imei':
          prompt = "Examinez cette capture d'écran et extrayez tous les IMEI présents. Pour les téléphones dual-SIM, il peut y avoir deux IMEI (IMEI1 pour SIM1 et IMEI2 pour SIM2). Extrayez également le numéro de série s'il est visible. Répondez uniquement avec un JSON contenant les champs 'imei1', 'imei2' et 'serialNumber'. Si un seul IMEI est trouvé, placez-le dans 'imei1' et mettez 'imei2' à null. Si aucun IMEI n'est trouvé, mettez les champs correspondants à null. Chaque IMEI doit contenir exactement 15 chiffres. Exemple de format de réponse : {\"imei1\": \"123456789012345\", \"imei2\": \"987654321098765\", \"serialNumber\": \"ABC123\"} ou {\"imei1\": \"123456789012345\", \"imei2\": null, \"serialNumber\": \"ABC123\"} pour un seul IMEI.";
          break;
        case 'serial':
          prompt = "Examinez cette capture d'écran et extrayez uniquement le numéro de série. Répondez uniquement avec un JSON contenant le champ 'serialNumber'. Si vous ne trouvez pas de numéro de série, mettez 'serialNumber' à null. Exemple de format de réponse : {\"serialNumber\": \"ABC123\"}";
          break;
        case 'specs':
          prompt = "Examinez cette capture d'écran et extrayez uniquement la RAM et le stockage. Répondez uniquement avec un JSON contenant les champs 'ram' et 'storage'. Si vous ne trouvez pas la RAM, mettez 'ram' à null. Si vous ne trouvez pas le stockage, mettez 'storage' à null. Exemple de format de réponse : {\"ram\": \"8GB\", \"storage\": \"128GB\"}";
          break;
      }

      // Envoi de la requête à OpenRouter
      
      // Utiliser fetch au lieu d'axios (identique au test qui fonctionne)
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'SecuriTel'
        },
        body: JSON.stringify({
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
        })
      });

      // Requête envoyée avec succès
      
      // Vérifier le statut de la réponse
      if (!response.ok) {
        const errorData = await response.text();
        console.error(`Erreur ${response.status}:`, errorData);
        
        if (response.status === 401) {
          throw new Error('Clé API OpenRouter invalide. Veuillez vérifier votre configuration.');
        } else if (response.status === 403) {
          throw new Error('Accès refusé. Vérifiez les permissions de votre clé API.');
        } else if (response.status === 429) {
          throw new Error('Quota OpenRouter dépassé. Veuillez réessayer plus tard.');
        } else if (response.status >= 500) {
          throw new Error(`Erreur serveur OpenRouter: ${response.statusText}`);
        } else {
          throw new Error(`Erreur OpenRouter (${response.status}): ${response.statusText}`);
        }
      }

      // Extraire la réponse JSON du modèle
      const responseData = await response.json();
      const content = responseData.choices[0].message.content;
      
      let extractedData = this.extractJsonFromResponse(content);
      
      // Nettoyer les valeurs extraites
      if (extractedData.imei1) {
        extractedData.imei1 = this.cleanExtractedValue(extractedData.imei1);
      }
      
      if (extractedData.imei2) {
        extractedData.imei2 = this.cleanExtractedValue(extractedData.imei2);
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

      // Compter le nombre d'IMEI extraits
      const imeiCount = (extractedData.imei1 ? 1 : 0) + (extractedData.imei2 ? 1 : 0);

      console.log('Données extraites après nettoyage:', extractedData);
      console.log('Nombre d\'IMEI extraits:', imeiCount);
      
      return {
        extractedData,
        confidence: 0.7, // Confiance pour le modèle gratuit
        imeiCount
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
   * Compare les données extraites par IA avec les données saisies pour les IMEI dual-SIM
   */
  validateExtractedData(
    extractedData: any,
    userInput: any,
    dataType: 'imei' | 'serial' | 'specs'
  ): { 
    isValid: boolean; 
    errors: string[];
    warnings: string[];
    suggestions: string[];
    imeiValidation?: {
      imei1Match: boolean;
      imei2Match: boolean;
      extractedCount: number;
      userCount: number;
      missingFields: string[];
    }
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
    
    switch (dataType) {
      case 'imei':
        const imeiValidation = this.validateDualIMEI(extractedData, userInput);
        
        // Ajouter les résultats de validation
        if (imeiValidation.errors.length > 0) {
          errors.push(...imeiValidation.errors);
        }
        if (imeiValidation.warnings.length > 0) {
          warnings.push(...imeiValidation.warnings);
        }
        if (imeiValidation.suggestions.length > 0) {
          suggestions.push(...imeiValidation.suggestions);
        }
        
        // Valider le numéro de série si présent
        if (extractedData.serialNumber && userInput.serial_number) {
          const cleanExtractedSerial = this.cleanExtractedValue(extractedData.serialNumber);
          const cleanUserSerial = this.cleanExtractedValue(userInput.serial_number);
          
          if (cleanExtractedSerial !== cleanUserSerial) {
            errors.push(`Le numéro de série extrait (${cleanExtractedSerial}) ne correspond pas au numéro de série saisi (${cleanUserSerial})`);
          }
        }
        
        return {
          isValid: errors.length === 0,
          errors,
          warnings,
          suggestions,
          imeiValidation: {
            imei1Match: imeiValidation.imei1Match,
            imei2Match: imeiValidation.imei2Match,
            extractedCount: imeiValidation.extractedCount,
            userCount: imeiValidation.userCount,
            missingFields: imeiValidation.missingImeiFields
          }
        };
        
      case 'serial':
        if (extractedData.serialNumber && userInput.serial_number) {
          const cleanExtractedSerial = this.cleanExtractedValue(extractedData.serialNumber);
          const cleanUserSerial = this.cleanExtractedValue(userInput.serial_number);
          
          if (cleanExtractedSerial !== cleanUserSerial) {
            errors.push(`Le numéro de série extrait (${cleanExtractedSerial}) ne correspond pas au numéro de série saisi (${cleanUserSerial})`);
          }
        }
        break;
        
      case 'specs':
        if (extractedData.ram && userInput.ram) {
          const cleanExtractedRam = this.cleanExtractedValue(extractedData.ram);
          const cleanUserRam = this.cleanExtractedValue(userInput.ram);
          
          if (cleanExtractedRam !== cleanUserRam) {
            errors.push(`La RAM extraite (${cleanExtractedRam}) ne correspond pas à la RAM saisie (${cleanUserRam})`);
          }
        }
        
        if (extractedData.storage && userInput.storage) {
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
      errors,
      warnings,
      suggestions
    };
  }

  /**
   * Validation spécialisée pour les IMEI dual-SIM
   */
  private validateDualIMEI(extractedData: any, userInput: any): {
    imei1Match: boolean;
    imei2Match: boolean;
    extractedCount: number;
    userCount: number;
    missingImeiFields: string[];
    errors: string[];
    warnings: string[];
    suggestions: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
    const missingImeiFields: string[] = [];
    
    // Nettoyer et compter les IMEI extraits
    const extractedImei1 = extractedData.imei1 ? this.cleanExtractedValue(extractedData.imei1) : null;
    const extractedImei2 = extractedData.imei2 ? this.cleanExtractedValue(extractedData.imei2) : null;
    const extractedCount = (extractedImei1 ? 1 : 0) + (extractedImei2 ? 1 : 0);
    
    // Nettoyer et compter les IMEI saisis par l'utilisateur
    const userImei1 = userInput.imei1 ? this.cleanExtractedValue(userInput.imei1) : null;
    const userImei2 = userInput.imei2 ? this.cleanExtractedValue(userInput.imei2) : null;
    const userCount = (userImei1 ? 1 : 0) + (userImei2 ? 1 : 0);
    
    // Variables de correspondance
    let imei1Match = false;
    let imei2Match = false;
    
    console.log('Validation dual-IMEI:', {
      extractedImei1,
      extractedImei2,
      userImei1,
      userImei2,
      extractedCount,
      userCount
    });
    
    // Cas 1: L'utilisateur n'a saisi qu'un IMEI mais l'IA en a trouvé plusieurs
    if (userCount === 1 && extractedCount > 1) {
      // Vérifier si l'IMEI saisi correspond à l'un des IMEI extraits
      const userImei = userImei1 || userImei2;
      
      if (userImei === extractedImei1) {
        imei1Match = true;
        warnings.push(`Vous avez saisi l'IMEI1: ${userImei}`);
        suggestions.push(`L'IA a détecté un second IMEI (IMEI2: ${extractedImei2}). Veuillez saisir l'IMEI2 pour valider complètement votre téléphone dual-SIM.`);
        missingImeiFields.push('imei2');
      } else if (userImei === extractedImei2) {
        imei2Match = true;
        warnings.push(`Vous avez saisi l'IMEI2: ${userImei}`);
        suggestions.push(`L'IA a détecté un premier IMEI (IMEI1: ${extractedImei1}). Veuillez saisir l'IMEI1 pour valider complètement votre téléphone dual-SIM.`);
        missingImeiFields.push('imei1');
      } else {
        errors.push(`L'IMEI saisi (${userImei}) ne correspond à aucun des IMEI extraits (IMEI1: ${extractedImei1}, IMEI2: ${extractedImei2})`);
      }
    }
    // Cas 2: L'utilisateur a saisi deux IMEI et l'IA en a trouvé plusieurs
    else if (userCount > 1 && extractedCount > 1) {
      // Comparaison directe
      if (userImei1 === extractedImei1) {
        imei1Match = true;
      } else if (userImei1 && extractedImei1) {
        errors.push(`L'IMEI1 saisi (${userImei1}) ne correspond pas à l'IMEI1 extrait (${extractedImei1})`);
      }
      
      if (userImei2 === extractedImei2) {
        imei2Match = true;
      } else if (userImei2 && extractedImei2) {
        errors.push(`L'IMEI2 saisi (${userImei2}) ne correspond pas à l'IMEI2 extrait (${extractedImei2})`);
      }
      
      // Vérifier si les IMEI sont inversés
      if (!imei1Match && !imei2Match && userImei1 === extractedImei2 && userImei2 === extractedImei1) {
        warnings.push(`Les IMEI semblent être inversés. IMEI1 saisi correspond à IMEI2 extrait et vice versa.`);
        suggestions.push(`Veuillez vérifier l'ordre des IMEI sur votre appareil.`);
      }
    }
    // Cas 3: L'utilisateur a saisi plusieurs IMEI mais l'IA n'en a trouvé qu'un
    else if (userCount > 1 && extractedCount === 1) {
      const extractedImei = extractedImei1 || extractedImei2;
      
      if (userImei1 === extractedImei) {
        imei1Match = true;
        warnings.push(`Seul l'IMEI1 a pu être extrait de l'image: ${extractedImei}`);
      } else if (userImei2 === extractedImei) {
        imei2Match = true;
        warnings.push(`L'IMEI extrait correspond à votre IMEI2: ${extractedImei}`);
      } else {
        errors.push(`L'IMEI extrait (${extractedImei}) ne correspond à aucun des IMEI saisis`);
      }
    }
    // Cas 4: Correspondance simple (1 IMEI saisi, 1 IMEI extrait)
    else if (userCount === 1 && extractedCount === 1) {
      const userImei = userImei1 || userImei2;
      const extractedImei = extractedImei1 || extractedImei2;
      
      if (userImei === extractedImei) {
        // Déterminer quel IMEI correspond
        if (userImei1) {
          imei1Match = true;
        } else {
          imei2Match = true;
        }
      } else {
        errors.push(`L'IMEI saisi (${userImei}) ne correspond pas à l'IMEI extrait (${extractedImei})`);
      }
    }
    // Cas 5: Aucun IMEI extrait
    else if (extractedCount === 0) {
      errors.push(`Aucun IMEI n'a pu être extrait de l'image. Veuillez vous assurer que l'image est claire et contient les informations IMEI.`);
    }
    
    return {
      imei1Match,
      imei2Match,
      extractedCount,
      userCount,
      missingImeiFields,
      errors,
      warnings,
      suggestions
    };
  }
}

export const iaAnalysisService = new IAAnalysisService();