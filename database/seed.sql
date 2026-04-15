-- ============================================
-- SEED : 20 signalements de test pour Paris
-- ============================================
-- 
-- IMPORTANT : Avant d'executer, créer un user demo dans Supabase :
-- 1. Authentication > Users > Add user
-- 2. Email : demo@notworking.fr / Password : demo123456
-- 3. Auto Confirm User : coche
-- 4. Recuperer l'UID et le coller ci-dessous a la place de COLLE_TON_UID_ICI
-- ============================================

DO $$
DECLARE
  demo_user_id UUID := 'b2d9d501-700d-463c-8c10-5e87bfed8d17';
BEGIN

UPDATE public.profiles SET username = 'demo_paris' WHERE id = demo_user_id;

INSERT INTO public.reports (user_id, category, title, description, location_name, latitude, longitude, status, created_at) VALUES
(demo_user_id, 'ascenseur', 'Ascenseur HS', 'Ascenseur principal en panne depuis 3 jours, impossible pour PMR de sortir', 'Métro Châtelet, sortie place Sainte-Opportune', 48.8584, 2.3470, 'en_panne', NOW() - INTERVAL '3 days'),
(demo_user_id, 'escalator', 'Escalator bloqué', 'Escalator côté quai 4 totalement à l''arrêt', 'RER Châtelet-Les Halles, ligne A', 48.8617, 2.3477, 'en_panne', NOW() - INTERVAL '1 day'),
(demo_user_id, 'distributeur', 'Distributeur en panne', 'Le distributeur affiche un écran noir', 'BNP Paribas, rue de Rivoli', 48.8589, 2.3500, 'en_panne', NOW() - INTERVAL '2 days'),
(demo_user_id, 'porte_automatique', 'Porte coincée', 'Porte automatique de l''entrée principale qui reste ouverte', 'BHV Marais, rue de Rivoli', 48.8569, 2.3530, 'en_panne', NOW() - INTERVAL '5 hours'),
(demo_user_id, 'escalator', 'Escalator hors service', 'Escalator menant aux quais grandes lignes en panne', 'Gare du Nord, hall principal', 48.8809, 2.3553, 'en_panne', NOW() - INTERVAL '6 hours'),
(demo_user_id, 'ascenseur', 'Ascenseur PMR HS', 'Ascenseur d''accès au quai 19 inutilisable', 'Gare du Nord, accès TER', 48.8814, 2.3559, 'en_panne', NOW() - INTERVAL '12 hours'),
(demo_user_id, 'borne_recharge', 'Borne de recharge HS', 'Borne pour véhicules électriques ne fonctionne plus', 'Place de la République, parking', 48.8676, 2.3631, 'resolu', NOW() - INTERVAL '4 days'),
(demo_user_id, 'eclairage', 'Lampadaire éteint', 'Tout le pâté de maisons est dans le noir la nuit', 'Rue de Belleville, niveau n°45', 48.8721, 2.3784, 'en_panne', NOW() - INTERVAL '2 days'),
(demo_user_id, 'ascenseur', 'Ascenseur PMR cassé', 'Très problématique pour les personnes âgées du quartier', 'Métro Bastille, sortie Opéra', 48.8530, 2.3691, 'en_panne', NOW() - INTERVAL '8 days'),
(demo_user_id, 'horodateur', 'Horodateur cassé', 'Impossible de payer le stationnement', 'Place de la Nation, côté nord', 48.8485, 2.3958, 'en_panne', NOW() - INTERVAL '1 day'),
(demo_user_id, 'interphone', 'Interphone HS', 'Personne ne peut être contacté à l''immeuble', 'Rue de la Roquette, n°120', 48.8560, 2.3781, 'en_panne', NOW() - INTERVAL '3 hours'),
(demo_user_id, 'escalator', 'Escalator en panne', 'Quai sud inaccessible facilement', 'Métro Montparnasse-Bienvenüe', 48.8443, 2.3211, 'en_panne', NOW() - INTERVAL '1 day'),
(demo_user_id, 'borne_information', 'Borne info plantée', 'Écran tactile gelé sur la borne d''info touristique', 'Place Denfert-Rochereau', 48.8338, 2.3324, 'en_panne', NOW() - INTERVAL '2 days'),
(demo_user_id, 'ascenseur', 'Ascenseur en panne', 'Bloqué au niveau -2 depuis ce matin', 'Centre commercial Italie 2', 48.8313, 2.3556, 'en_panne', NOW() - INTERVAL '5 hours'),
(demo_user_id, 'distributeur', 'Distributeur vide', 'Plus de billets et écran d''erreur affiché', 'Société Générale, avenue des Champs-Élysées', 48.8709, 2.3074, 'en_panne', NOW() - INTERVAL '6 hours'),
(demo_user_id, 'escalator', 'Escalator HS', 'Escalator de la station vers les Champs en panne', 'Métro George V', 48.8721, 2.3009, 'resolu', NOW() - INTERVAL '7 days'),
(demo_user_id, 'porte_automatique', 'Porte qui claque', 'Porte coulissante qui s''ouvre/ferme sans arrêt', 'Galeries Lafayette Haussmann', 48.8738, 2.3324, 'en_panne', NOW() - INTERVAL '4 hours'),
(demo_user_id, 'eclairage', 'Pas d''éclairage public', 'Toute la rue est éteinte la nuit, dangereux', 'Rue Mouffetard, niveau n°60', 48.8421, 2.3494, 'en_panne', NOW() - INTERVAL '3 days'),
(demo_user_id, 'horodateur', 'Horodateur HS', 'Affiche "hors service" en permanence', 'Boulevard Saint-Germain, niveau n°150', 48.8534, 2.3387, 'en_panne', NOW() - INTERVAL '1 day'),
(demo_user_id, 'ascenseur', 'Ascenseur arrêté', 'L''ascenseur reste bloqué entre deux étages', 'Métro Opéra, sortie boulevard des Capucines', 48.8709, 2.3325, 'en_panne', NOW() - INTERVAL '30 minutes');

END $$;