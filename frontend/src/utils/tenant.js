const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'restroscans.com';

export function tenantFromHostname(hostname) {
  const host = String(hostname || '').split(':')[0].toLowerCase();
  if (!host || host === 'localhost' || host === '127.0.0.1') {
    return null;
  }
  if (host.endsWith('.localhost')) {
    const label = host.slice(0, -'.localhost'.length);
    return label && label !== 'www' ? label : null;
  }
  if (host === BASE_DOMAIN || host === `www.${BASE_DOMAIN}`) {
    return null;
  }
  const suffix = `.${BASE_DOMAIN}`;
  if (host.endsWith(suffix)) {
    const label = host.slice(0, -suffix.length);
    if (label && label !== 'www' && !label.includes('.')) {
      return label;
    }
  }
  return null;
}

export function resolveTenantSlug() {
  if (typeof window === 'undefined') {
    return null;
  }
  const fromHost = tenantFromHostname(window.location.hostname);
  if (fromHost) {
    localStorage.setItem('tenantName', fromHost);
    return fromHost;
  }
  const parts = window.location.pathname.split('/').filter(Boolean);
  if (parts.length > 1 && parts[parts.length - 1] === 'home') {
    localStorage.setItem('tenantName', parts[0]);
    return parts[0];
  }
  return localStorage.getItem('tenantName');
}
