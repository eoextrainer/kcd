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

export const getApiBaseUrl = () => {
  const envBase = import.meta.env.VITE_API_BASE_URL;
  if (envBase) {
    return normalizeApiBase(normalizeBaseUrl(envBase));
  }

  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    if (origin.includes('kcd-frontend')) {
      const inferred = origin.replace('kcd-frontend', 'kcd-api');
      return normalizeApiBase(normalizeBaseUrl(inferred));
    }
  }

  return '/api';
};
