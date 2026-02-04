const normalizeBaseUrl = (url) => {
  if (!url) return '';
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

const normalizeApiBase = (url) => {
  if (!url) return '';
  if (url.endsWith('/api/v1')) {
    return url.slice(0, -3);
  }
  if (url.endsWith('/v1')) {
    return url.slice(0, -3);
  }
  if (url.endsWith('/api')) {
    return url;
  }
  return `${url}/api`;
};

const DEFAULT_RENDER_BACKEND = 'https://kcd-backend-xeak.onrender.com';

export const getApiBaseUrl = () => {
  const envBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
  if (envBase) {
    return normalizeApiBase(normalizeBaseUrl(envBase));
  }

  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    if (origin.includes('kcd-frontend')) {
      return normalizeApiBase(normalizeBaseUrl(DEFAULT_RENDER_BACKEND));
    }
  }

  return '/api';
};

export const getApiBaseCandidates = () => {
  const base = getApiBaseUrl();
  const candidates = new Set();
  if (base) {
    candidates.add(base);
  }

  if (base.endsWith('/api')) {
    candidates.add(base.slice(0, -4));
  } else if (!base.endsWith('/api')) {
    candidates.add(`${base}/api`);
  }

  return Array.from(candidates).filter(Boolean);
};
