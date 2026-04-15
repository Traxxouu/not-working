# 🚧 Not Working

Plateforme collaborative de signalement des pannes d'équipements publics à Paris.
Pour améliorer l'accessibilité au quotidien.

## 👥 Équipe

- **Maël Barbe** — Setup, base de données, authentification, service layer
- **Hugo Tchen** — Système de confirmation des pannes
- **Elisei Jurgiu** — Design et composants UI
- **Hugo & Elisei** — Intégration CRUD frontend

## 🛠️ Stack technique

- **Frontend** : React 18 + Vite
- **Styling** : Tailwind CSS
- **Backend / DB / Auth** : Supabase (PostgreSQL + Auth + RLS)
- **Carte** : Leaflet + OpenStreetMap
- **Routing** : React Router v6

## 🚀 Installation

1. Cloner le repo
```bash
   git clone <url-du-repo>
   cd not-working
```

2. Installer les dépendances
```bash
   npm install
```

3. Créer un fichier `.env` à partir de `.env.example` et remplir avec vos clés Supabase

4. Lancer le projet
```bash
   npm run dev
```

## 🗄️ Base de données

Le schéma SQL complet est disponible dans `database/schema.sql`.
À exécuter dans le SQL Editor de Supabase.

## 📦 Fonctionnalités

- Authentification (inscription / connexion)
- Signalement de pannes (CRUD complet)
- Confirmation collaborative des pannes
- Carte interactive de Paris avec tous les signalements
- Filtres par catégorie d'équipement
