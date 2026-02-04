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
const FALLBACK_RENDER_BACKENDS = [DEFAULT_RENDER_BACKEND];
const BLOCKED_API_HOSTS = new Set([
  'https://kcd-api-jf14.onrender.com',
  'http://kcd-api-jf14.onrender.com',
]);

const getStoredApiBase = () => {
  if (typeof window === 'undefined') return '';
  try {
    const stored = normalizeApiBase(normalizeBaseUrl(localStorage.getItem('api_base')));
    if (stored && !BLOCKED_API_HOSTS.has(stored)) {
      return stored;
    }
    return '';
  } catch (err) {
    return '';
  }
};

export const getApiBaseUrl = () => {
  const storedBase = getStoredApiBase();
  if (storedBase) {
    return storedBase;
  }

  const envBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
  if (envBase) {
    const normalized = normalizeApiBase(normalizeBaseUrl(envBase));
    if (!BLOCKED_API_HOSTS.has(normalized)) {
      return normalized;
    }
  }

  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    if (origin.includes('kcd-frontend')) {
      return normalizeApiBase(normalizeBaseUrl(DEFAULT_RENDER_BACKEND));
    }
    if (origin.includes('onrender.com')) {
      return normalizeApiBase(normalizeBaseUrl(DEFAULT_RENDER_BACKEND));
    }
  }

  return '/api';
};

export const getApiBaseCandidates = () => {
  const base = getApiBaseUrl();
  const candidates = new Set();
  const storedBase = getStoredApiBase();

  [storedBase, base, ...FALLBACK_RENDER_BACKENDS].forEach((item) => {
    if (item && !BLOCKED_API_HOSTS.has(item)) {
      candidates.add(item);
    }
  });

  if (base.endsWith('/api')) {
    const trimmed = base.slice(0, -4);
    if (!BLOCKED_API_HOSTS.has(trimmed)) {
      candidates.add(trimmed);
    }
  } else if (!base.endsWith('/api')) {
    const withApi = `${base}/api`;
    if (!BLOCKED_API_HOSTS.has(withApi)) {
      candidates.add(withApi);
    }
  }

  return Array.from(candidates).filter(Boolean);
};
