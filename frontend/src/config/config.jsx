const baseURL = '';

const isLoopbackHost = (host) => /^(localhost|127\.0\.0\.1|\[::1\])$/i.test(host) || /\.localhost$/i.test(host);

function wsOriginFromEnv(value) {
  const origin = String(value || '').trim().replace(/\/+$/, '');
  if (!origin || typeof window === 'undefined' || isLoopbackHost(window.location.hostname)) return origin;
  try {
    return isLoopbackHost(new URL(origin).hostname) ? '' : origin;
  } catch (err) {
    return '';
  }
}

const config = {
  siteURL: '',
  apiBaseURL: `${baseURL}/api/v1`,
  staticBaseURL: `${baseURL}`,
  apiTimeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS) || 30000,
  wsOrigin: wsOriginFromEnv(process.env.NEXT_PUBLIC_WS_ORIGIN),
};

export default config;
