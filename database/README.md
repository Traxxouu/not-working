# 🗄️ Base de données — Not Working

## Stack
- PostgreSQL (via Supabase)
- Authentification : Supabase Auth (JWT)
- Sécurité : Row Level Security (RLS) activée sur toutes les tables

## Installation

1. Créer un projet sur [Supabase](https://supabase.com)
2. Aller dans **SQL Editor**
3. Copier-coller le contenu de `schema.sql`
4. Cliquer sur **Run**
5. Désactiver "Confirm email" dans Authentication > Providers > Email (pour le dev)

## Schéma

### Tables

- **profiles** : Profils publics des utilisateurs (extension de `auth.users`)
- **reports** : Signalements de pannes d'équipements publics
- **confirmations** : Confirmations des pannes par les utilisateurs

### Triggers automatiques

- Création automatique d'un profile à l'inscription
- Mise à jour automatique du compteur `confirmations_count`
- Mise à jour automatique du champ `updated_at`

### Sécurité (RLS)

- Lecture publique des signalements et profiles
- Création/modification/suppression réservée au propriétaire
- Une seule confirmation par utilisateur par signalement (contrainte UNIQUE)

## 🌱 Seed (données de test)

Pour avoir 20 signalements de test sur la carte de Paris :

1. Créer un user demo dans Supabase Authentication > Users > Add user :
   - Email : `demo@notworking.fr`
   - Password : `demo123456`
   - Auto Confirm User : ✅
2. Récupérer l'UID du user créé
3. Ouvrir `seed.sql`, remplacer `COLLE_TON_UID_ICI` par l'UID
4. Exécuter le script dans le SQL Editor de Supabase