# SecuriTel Platform

Plateforme de sécurisation des téléphones portables contre le vol, la perte et les arnaques au Bénin.

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation
```bash
# Cloner le repository
git clone [votre-repo]
cd securitel_v2

# Installer les dépendances
npm install
```

### Configuration
Créer un fichier `.env` à la racine du projet :
```env
VITE_API_URL=https://api.securitels.com/api/docs
```

### Lancement en développement
```bash
npm run dev
```

L'application sera accessible sur http://localhost:3000

## 🏗️ Structure du projet

```
securitel_v2/
├── src/
│   ├── components/      # Composants réutilisables
│   │   ├── layouts/     # Layouts de l'application
│   │   └── ui/          # Composants UI de base
│   ├── pages/           # Pages de l'application
│   │   ├── auth/        # Pages d'authentification
│   │   ├── dashboard/   # Tableau de bord
│   │   ├── phones/      # Gestion des téléphones
│   │   ├── reports/     # Signalements
│   │   ├── verification/# Vérification IMEI
│   │   ├── history/     # Historique
│   │   └── profile/     # Profil utilisateur
│   ├── services/        # Services API
│   ├── store/           # Gestion d'état (Zustand)
│   ├── types/           # Types TypeScript
│   ├── utils/           # Utilitaires
│   └── hooks/           # Hooks personnalisés
```

## 📱 Fonctionnalités principales

### Pour les utilisateurs
- **Enregistrement de téléphones** : Protégez vos appareils avec IMEI et preuves
- **Vérification IMEI** : Vérifiez le statut d'un téléphone avant achat
- **Signalements** : Déclarez vol, perte ou téléphone suspect
- **Gestion du statut** : Marquez un téléphone comme récupéré
- **Transfert de propriété** : Transférez en toute sécurité
- **Historique** : Consultez toutes vos actions

### Sécurité
- Authentification sécurisée
- Vérification 2FA par email
- Chiffrement des données sensibles
- Validation des actions critiques

## 🛠️ Technologies utilisées

- **Frontend** : React 18 + TypeScript
- **Styling** : Tailwind CSS
- **Routing** : React Router v6
- **State Management** : Zustand
- **API Client** : Axios + React Query
- **Forms** : React Hook Form
- **Icons** : Lucide React
- **Build Tool** : Vite

## 📄 Pages implémentées

✅ Pages complètes :
- Page d'accueil publique
- Connexion / Inscription
- Tableau de bord
- Enregistrement de téléphone
- Vérification IMEI
- Liste des téléphones
- Gestion du statut

🚧 Pages en développement :
- Transfert de propriété
- Signalement de vol/perte
- Historique détaillé
- Paramètres du profil
- Devenir agent

## 🔐 Sécurité et conformité

- Respect du RGPD
- Chiffrement AES-256
- Authentification JWT
- Validation côté serveur
- Protection CSRF

## 📞 Support

- Email : contact@securitel.bj
- WhatsApp : +229 XX XX XX XX

## 📝 Licence

© 2025 SecuriTel. Tous droits réservés.
