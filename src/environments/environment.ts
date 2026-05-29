export const environment = {
  production: false,
  // Empty string -> requests go through proxy.conf.json to BFF on :8083.
  // Override to a full URL when running without dev proxy.
  apiBaseUrl: ''
};
