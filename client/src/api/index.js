import axios from 'axios';

const apiUrl = process.env.BACKEND_API;

const instance = axios.create({
  baseURL: `${apiUrl}/api`,
  withCredentials: true,
});

export const api = Object.freeze({
  jwt: {
    // Login by JSON Web Token
    login: async () => {
      const res = await instance.get('/auth/jwt/login');
      return res;
    },
    logout: async () => {
      await instance.get('/auth/jwt/logout');
    },
    loginStatus: async () => {
      const res = await instance.get('/auth/jwt/login-status');
      return JSON.parse(res.data); // response boolean
    },
  },
  acg: {
    // Login by Authorization Code Grant
    login: () => {
      // Avoid here XHR requests because we encounter problems with CORS for ACG Authorization
      window.location.href = `${apiUrl}/api/auth/passport/login`;
    },
    logout: async () => {
      await instance.get('/auth/passport/logout');
    },
    callbackExecute: async code => {
      const res = await instance.get(`/auth/passport/callback?code=${code}`);
      return res;
    },
    loginStatus: async () => {
      const res = await instance.get('/auth/passport/login-status');
      return JSON.parse(res.data); // response boolean
    },
  },
});
