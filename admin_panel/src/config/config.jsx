const env = process.env;
const isBrowser = typeof window !== 'undefined';
const pageHost = isBrowser ? window.location.hostname : '';

const LOOPBACK = /^(localhost|127\.0\.0\.1|\[::1\])$/i;
const isLoopbackHost = (host) => LOOPBACK.test(host) || /\.localhost$/i.test(host);
const pageIsLocal = !pageHost || isLoopbackHost(pageHost);

const trimSlash = (value) => String(value || '').trim().replace(/\/+$/, '');

function originFromEnv(value) {
  const origin = trimSlash(value);
  if (!origin || pageIsLocal) return origin;
  try {
    return isLoopbackHost(new URL(origin).hostname) ? '' : origin;
  } catch (err) {
    return '';
  }
}

// The staff app runs on :3001 and does not proxy /api. A loopback API origin
// (127.0.0.1:8000) must become this restaurant's host on Django's port, so
// tenant1.restroscans.com:3001 still calls tenant1.restroscans.com:8000.
function serviceOrigin(value) {
  const origin = trimSlash(value);
  if (!origin || pageIsLocal) return origin;
  try {
    const parsed = new URL(origin);
    if (!isLoopbackHost(parsed.hostname)) return origin;
    const protocol = isBrowser && window.location.protocol === 'https:' ? 'https:' : 'http:';
    const port = parsed.port ? `:${parsed.port}` : '';
    return `${protocol}//${pageHost}${port}`;
  } catch (err) {
    return '';
  }
}

const apiOrigin = serviceOrigin(env.REACT_APP_API_ORIGIN);
const wsOrigin = serviceOrigin(env.REACT_APP_WS_ORIGIN);

export const baseDomain = env.REACT_APP_BASE_DOMAIN || 'restroscans.com';
export const domainURL = env.REACT_APP_AUTH_PATH || 'restroscans';

const pageProtocol = isBrowser && window.location.protocol === 'https:' ? 'https:' : 'http:';
const siteTemplateFromEnv = String(env.REACT_APP_CUSTOMER_SITE_URL_TEMPLATE || '').trim();
const customerSiteTemplate =
  siteTemplateFromEnv && originFromEnv(siteTemplateFromEnv.split('{tenant}').join('tenant'))
    ? siteTemplateFromEnv
    : `${pageProtocol}//{tenant}.${baseDomain}/`;

export function customerSiteUrl(tenant) {
  return customerSiteTemplate.split('{tenant}').join(encodeURIComponent(tenant || ''));
}

export function webSocketUrl(path) {
  if (wsOrigin) return `${wsOrigin}${path}`;
  if (apiOrigin) return `${apiOrigin.replace(/^http/i, 'ws')}${path}`;
  const proto = isBrowser && window.location.protocol === 'https:' ? 'wss' : 'ws';
  return `${proto}://${isBrowser ? window.location.host : ''}${path}`;
}
const config = {
  siteURL: apiOrigin ? apiOrigin.replace(/^https?:\/\//i, '') : isBrowser ? window.location.host : '',
  apiBaseURL: `${apiOrigin}/api/v1`,
  staticBaseURL: apiOrigin,
  imageUrl: `${apiOrigin}/media/`,
  apiTimeout: Number(env.REACT_APP_API_TIMEOUT_MS) || 60000,
};
export default config;
