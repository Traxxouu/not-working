export const CATEGORIES = {
  ascenseur: { label: 'Ascenseur', icon: '🛗', color: '#3b82f6' },
  escalator: { label: 'Escalator', icon: '⤴️', color: '#8b5cf6' },
  distributeur: { label: 'Distributeur', icon: '🏧', color: '#10b981' },
  borne_recharge: { label: 'Borne de recharge', icon: '🔌', color: '#f59e0b' },
  horodateur: { label: 'Horodateur', icon: '🅿️', color: '#ef4444' },
  porte_automatique: { label: 'Porte automatique', icon: '🚪', color: '#6366f1' },
  eclairage: { label: 'Éclairage public', icon: '💡', color: '#eab308' },
  interphone: { label: 'Interphone', icon: '📞', color: '#06b6d4' },
  borne_information: { label: 'Borne info', icon: 'ℹ️', color: '#64748b' },
}

export const STATUSES = {
  en_panne: { label: 'En panne', color: '#ef4444', bgColor: '#fee2e2' },
  resolu: { label: 'Résolu', color: '#10b981', bgColor: '#d1fae5' },
}

export const getCategoryLabel = (key) => CATEGORIES[key]?.label || key
export const getCategoryIcon = (key) => CATEGORIES[key]?.icon || '📍'
export const getStatusLabel = (key) => STATUSES[key]?.label || key
export const getStatusColor = (key) => STATUSES[key]?.color || '#64748b'