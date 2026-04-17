# 🚧 Not Working

**Plateforme collaborative de signalement des pannes d'équipements publics à Paris.**

Signalez. Confirmez. *Améliorons Paris ensemble.*

---

## 🎯 Problématique

Chaque jour à Paris, des ascenseurs de métro tombent en panne, des escalators s'arrêtent, des horodateurs refusent les paiements. Ces pannes impactent particulièrement les personnes à mobilité réduite, les parents avec poussettes et les personnes âgées. **Not Working** est la plateforme citoyenne qui permet de signaler, confirmer et suivre ces pannes en temps réel.

---

## 👥 Équipe

| Membre | Rôle | Contributions |
|--------|------|---------------|
| **Maël Barbe** | Lead Dev / Backend | Architecture, BDD, Auth Supabase, service layer, pages CRUD, page admin, carte interactive |
| **Hugo Tchen** | Frontend / Routing | React Router, pages auth, composant carte Leaflet, page 404 |
| **Elisei Jurgiu** | Design / UI | Design system, landing page, composants UI, carrousels, sections visuelles |

---

## 🛠️ Stack technique

| Couche | Technologies |
|--------|-------------|
| **Frontend** | React 19, Vite 8, Tailwind CSS 3, React Router v7 |
| **Carte** | Leaflet, React-Leaflet, OpenStreetMap, Nominatim (géocodage) |
| **Backend / BDD / Auth** | Supabase (PostgreSQL, Auth JWT, Row Level Security) |
| **Design** | Fraunces (serif), Inter (sans-serif), palette ink/cream/primary/accent |
| **Tooling** | Git, GitHub, ESLint, PostCSS, Autoprefixer |

---

## 🚀 Installation

### Prérequis

- Node.js >= 20
- npm
- Un projet Supabase (gratuit sur [supabase.com](https://supabase.com))

### 1. Cloner le repo

```bash
git clone https://github.com/Traxxouu/not-working.git
cd not-working
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer l'environnement

Copier le fichier `.env.example` en `.env` et remplir avec vos clés Supabase :

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_anon_key
```

### 4. Configurer la base de données

1. Aller dans le **SQL Editor** de Supabase
2. Copier-coller le contenu de `database/schema.sql`
3. Cliquer sur **Run**
4. Désactiver "Confirm email" dans **Authentication > Providers > Email** (pour le dev)

### 5. Ajouter des données de test (optionnel)

1. Créer un utilisateur de test dans **Authentication > Users > Add user** :
   - Email : `demo@notworking.fr`
   - Password : `demo123456`
   - Auto Confirm User : ✅
2. Récupérer l'UID du user créé
3. Ouvrir `database/seed.sql`, remplacer le placeholder par l'UID
4. Exécuter le script dans le SQL Editor

### 6. Lancer le projet

```bash
npm run dev
```

Le site est accessible sur `http://localhost:5173`

---

## 📦 Fonctionnalités

### Authentification
- Inscription avec pseudo unique, email et mot de passe
- Connexion / Déconnexion avec persistance de session
- Profil utilisateur avec avatar généré automatiquement

### CRUD Signalements
- **Create** : Wizard en 3 étapes (catégorie → description → position sur carte)
- **Read** : Page détail avec carte, description, compteur de confirmations
- **Update** : Marquer comme résolu / remettre en panne (admin uniquement)
- **Delete** : Suppression par le créateur ou par un admin

### Carte interactive
- Carte OpenStreetMap centrée sur Paris
- Markers colorés par catégorie avec icônes personnalisées
- Bottom sheet mobile-first avec liste scrollable
- Barre de recherche avec géocodage Nominatim
- Filtres par catégorie et par statut
- Animation flyTo au clic sur un signalement
- Bouton flottant "+ Signaler"

### Système de confirmation collaborative
- Bouton "Je confirme cette panne" (toggle)
- Compteur de confirmations en temps réel
- Trigger SQL automatique pour le compteur

### Dashboard utilisateur
- Statistiques personnelles (signalements, confirmations, résolus)
- Système de points (2pts/signalement, 1pt/confirmation)
- 9 badges débloquables selon l'activité
- 5 niveaux de progression (Débutant → Légende)
- Liste des signalements avec actions

### Administration
- Tableau de bord avec statistiques globales
- Gestion de tous les signalements (résoudre, supprimer)
- Liste des utilisateurs inscrits
- Filtres et recherche avancée
- Accès protégé par rôle admin

### 9 catégories d'équipements
- 🛗 Ascenseurs
- ⤴️ Escalators
- 🏧 Distributeurs
- 🔌 Bornes de recharge
- 🅿️ Horodateurs
- 🚪 Portes automatiques
- 💡 Éclairage public
- 📞 Interphones
- ℹ️ Bornes d'information

---

## 🗄️ Base de données

### Schéma

3 tables principales avec Row Level Security (RLS) :

- **profiles** : Profils publics (username unique, email, avatar, rôle)
- **reports** : Signalements (catégorie, titre, description, position GPS, statut, compteur)
- **confirmations** : Confirmations citoyennes (contrainte unique user/report)

### Triggers automatiques

- Création de profil à l'inscription (`handle_new_user`)
- Mise à jour du compteur de confirmations (`update_confirmations_count`)
- Mise à jour automatique de `updated_at`

### Sécurité (RLS)

- Lecture publique des signalements et profils
- Création réservée aux utilisateurs connectés
- Modification/suppression par le créateur OU un admin
- Une seule confirmation par utilisateur par signalement

Le schéma complet est dans `database/schema.sql`.

---

## 📁 Structure du projet

```
not-working/
├── database/
│   ├── schema.sql          # Schéma complet de la BDD
│   ├── seed.sql            # Données de test (20 signalements Paris)
│   └── README.md           # Documentation BDD
├── public/
│   └── categories/         # Images des catégories (optionnel)
├── src/
│   ├── components/
│   │   ├── auth/           # ProtectedRoute
│   │   ├── landing/        # Sections de la landing page
│   │   ├── layout/         # Navbar, Footer, Layout
│   │   ├── map/            # Map, LocationPicker
│   │   └── ui/             # Button, Container, Section
│   ├── contexts/           # AuthContext, auth-context
│   ├── data/               # Données mock
│   ├── hooks/              # useAuth
│   ├── lib/                # supabase client, categories
│   ├── pages/              # Toutes les pages
│   │   ├── Home.jsx        # Landing page
│   │   ├── Login.jsx       # Connexion
│   │   ├── Signup.jsx      # Inscription
│   │   ├── MapPage.jsx     # Carte interactive
│   │   ├── ReportNew.jsx   # Création signalement (wizard)
│   │   ├── ReportDetail.jsx # Détail + confirmation
│   │   ├── Profile.jsx     # Dashboard utilisateur
│   │   ├── Admin.jsx       # Administration
│   │   ├── About.jsx       # À propos
│   │   └── NotFound.jsx    # Page 404
│   ├── services/           # Services Supabase
│   │   ├── auth.service.js
│   │   ├── reports.service.js
│   │   ├── confirmations.service.js
│   │   └── index.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 🔐 Comptes de test pour mon app

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Admin | *a@a.com* | *a123456* |
| Démo | demo@notworking.fr | demo123456 |

---

## 📄 Licence

Projet étudiant EFREI Paris B2 — Avril 2026

© 2026 Maël Barbe, Hugo Tchen, Elisei Jurgiu