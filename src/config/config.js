const config = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/',
  Inactive_timeout_sec: parseInt(process.env.REACT_APP_INACTIVE_TIMEOUT_SEC || '15000', 10),
  Session_timeout_sec: parseInt(process.env.REACT_APP_SESSION_TIMEOUT_SEC || '200000', 10),
};

export default config;

