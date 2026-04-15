-- ============================================
-- NOT WORKING - Schéma de base de données
-- ============================================

-- ============================================
-- 1. TABLE PROFILES (extension de auth.users)
-- ============================================
-- Supabase gère déjà auth.users pour la connexion
-- On crée profiles pour stocker les infos publiques

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherche rapide par username
CREATE INDEX idx_profiles_username ON public.profiles(username);

-- ============================================
-- 2. TABLE REPORTS (signalements de pannes)
-- ============================================

CREATE TYPE report_category AS ENUM (
  'ascenseur',
  'escalator',
  'distributeur',
  'borne_recharge',
  'horodateur',
  'porte_automatique',
  'eclairage',
  'interphone',
  'borne_information'
);

CREATE TYPE report_status AS ENUM (
  'en_panne',
  'resolu'
);

CREATE TABLE public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  category report_category NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location_name TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  photo_url TEXT,
  status report_status DEFAULT 'en_panne' NOT NULL,
  confirmations_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  resolved_at TIMESTAMPTZ
);

-- Index pour les requêtes fréquentes
CREATE INDEX idx_reports_status ON public.reports(status);
CREATE INDEX idx_reports_category ON public.reports(category);
CREATE INDEX idx_reports_user_id ON public.reports(user_id);
CREATE INDEX idx_reports_created_at ON public.reports(created_at DESC);
CREATE INDEX idx_reports_location ON public.reports(latitude, longitude);

-- ============================================
-- 3. TABLE CONFIRMATIONS (qui confirme quoi)
-- ============================================

CREATE TABLE public.confirmations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  -- Un user ne peut confirmer qu'une seule fois par signalement
  UNIQUE(report_id, user_id)
);

CREATE INDEX idx_confirmations_report_id ON public.confirmations(report_id);
CREATE INDEX idx_confirmations_user_id ON public.confirmations(user_id);

-- ============================================
-- 4. TRIGGER : créer un profile automatiquement
-- quand un user s'inscrit via Supabase Auth
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 5. TRIGGER : update automatique du compteur
-- de confirmations sur reports
-- ============================================

CREATE OR REPLACE FUNCTION public.update_confirmations_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.reports
    SET confirmations_count = confirmations_count + 1
    WHERE id = NEW.report_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.reports
    SET confirmations_count = confirmations_count - 1
    WHERE id = OLD.report_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_update_confirmations_count
  AFTER INSERT OR DELETE ON public.confirmations
  FOR EACH ROW EXECUTE FUNCTION public.update_confirmations_count();

-- ============================================
-- 6. TRIGGER : update du champ updated_at
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- 7. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.confirmations ENABLE ROW LEVEL SECURITY;

-- ===== POLICIES PROFILES =====

-- Tout le monde peut voir tous les profiles (pseudo public)
CREATE POLICY "Profiles visibles par tous"
  ON public.profiles FOR SELECT
  USING (true);

-- Un user ne peut modifier que son propre profile
CREATE POLICY "Modifier son propre profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ===== POLICIES REPORTS =====

-- Tout le monde peut voir tous les signalements
CREATE POLICY "Signalements visibles par tous"
  ON public.reports FOR SELECT
  USING (true);

-- Seuls les users connectés peuvent créer
CREATE POLICY "Users connectes peuvent creer"
  ON public.reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Un user peut modifier seulement ses signalements
CREATE POLICY "Modifier ses propres signalements"
  ON public.reports FOR UPDATE
  USING (auth.uid() = user_id);

-- Un user peut supprimer seulement ses signalements
CREATE POLICY "Supprimer ses propres signalements"
  ON public.reports FOR DELETE
  USING (auth.uid() = user_id);

-- ===== POLICIES CONFIRMATIONS =====

-- Tout le monde peut voir les confirmations
CREATE POLICY "Confirmations visibles par tous"
  ON public.confirmations FOR SELECT
  USING (true);

-- Seuls les users connectés peuvent confirmer
CREATE POLICY "Users connectes peuvent confirmer"
  ON public.confirmations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Un user peut retirer sa propre confirmation
CREATE POLICY "Retirer sa propre confirmation"
  ON public.confirmations FOR DELETE
  USING (auth.uid() = user_id);


