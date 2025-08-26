# Guide de configuration OpenRouter pour SecuriTel

## Étape 1 : Création du compte OpenRouter

1. Rendez-vous sur [https://openrouter.ai/](https://openrouter.ai/)
2. Cliquez sur "Sign Up" pour créer un compte
3. Confirmez votre adresse e-mail

## Étape 2 : Création de la clé API

1. Une fois connecté, allez dans la section "Keys" : [https://openrouter.ai/keys](https://openrouter.ai/keys)
2. Cliquez sur "Create Key"
3. Donnez un nom à votre clé (ex: "SecuriTel App")
4. Copiez la clé API générée (commençant par `sk-or-v1-...`)

## Étape 3 : Configuration dans votre application

1. Ouvrez le fichier `.env` à la racine de votre projet
2. Ajoutez la ligne suivante :
   ```
   VITE_OPENROUTER_API_KEY=sk-or-v1-VOTRE_CLE_COPIEE_ICI
   ```
3. Remplacez `sk-or-v1-VOTRE_CLE_COPIEE_ICI` par la clé que vous avez copiée
4. Sauvegardez le fichier

## Étape 4 : Vérification de la configuration

1. Redémarrez votre serveur de développement
2. Accédez à la page de diagnostic : `/diagnostic`
3. Exécutez le test "Configuration OpenRouter"
4. Vérifiez que le test passe avec succès

## Modèles disponibles et leurs caractéristiques

### Modèles gratuits (recommandés pour commencer)
- `google/gemini-flash-1.5` : Bonne précision, gratuit, quota limité (modèle actuellement utilisé)
- `microsoft/phi-3-vision` : Précision moyenne, gratuit

### Modèles payants (meilleure précision)
- `openai/gpt-4-vision-preview` : Excellente précision, payant
- `anthropic/claude-3-sonnet` : Très bonne précision, payant

## Gestion du quota

### Vérification du quota
1. Connectez-vous à votre compte OpenRouter
2. Allez dans la section "Billing"
3. Consultez votre utilisation actuelle

### Augmenter le quota
- Les clés gratuites ont un quota limité (~100 requêtes par jour)
- Pour plus de requêtes, vous pouvez :
  1. Attendre le renouvellement quotidien du quota
  2. Utiliser plusieurs clés gratuites
  3. Passer à un plan payant

## Problèmes courants et solutions

### 1. "Clé API invalide"
**Symptômes** : Erreur 401 dans les tests
**Solutions** :
- Vérifiez que la clé est correctement copiée dans le fichier `.env`
- Assurez-vous qu'il n'y a pas d'espaces avant ou après la clé
- Vérifiez que la clé est active dans votre compte OpenRouter

### 2. "Accès refusé" (erreur 403)
**Symptômes** : Erreur 403 lors de l'analyse IA
**Solutions** :
- Votre clé gratuite n'a pas accès aux modèles payants
- Utilisez le modèle gratuit `google/gemini-flash-1.5`
- Passez à un plan payant pour accéder aux modèles premium

### 3. "Quota dépassé" (erreur 429)
**Symptômes** : Erreur 429 lors de l'analyse IA
**Solutions** :
- Attendez le renouvellement quotidien du quota (minuit UTC)
- Utilisez une autre clé API
- Passez à un plan payant pour un quota plus élevé

### 4. "Impossible de contacter OpenRouter"
**Symptômes** : Erreur de réseau lors des tests
**Solutions** :
- Vérifiez votre connexion internet
- Assurez-vous que https://openrouter.ai est accessible
- Vérifiez que votre pare-feu ou antivirus ne bloque pas les requêtes

## Bonnes pratiques

### Sécurité
- Ne partagez jamais votre clé API publiquement
- Utilisez des variables d'environnement pour stocker la clé
- Renouvelez régulièrement vos clés API

### Optimisation
- Utilisez des images de bonne qualité pour de meilleurs résultats
- Préférez le modèle gratuit `google/gemini-flash-1.5` si la précision est suffisante
- Implémentez une gestion d'erreurs robuste pour gérer les quotas

### Surveillance
- Surveillez régulièrement votre utilisation dans le tableau de bord OpenRouter
- Configurez des alertes si disponible
- Planifiez vos requêtes pour éviter les pics d'utilisation

## Support

Si vous rencontrez des problèmes persistants :
1. Consultez la documentation officielle : [https://openrouter.ai/docs](https://openrouter.ai/docs)
2. Contactez le support OpenRouter via leur site
3. Vérifiez le statut des services : [https://status.openrouter.ai/](https://status.openrouter.ai/)