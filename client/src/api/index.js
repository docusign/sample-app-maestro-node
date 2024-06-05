import axios from 'axios';

let apiUrl = process.env.BACKEND_API;

const api = axios.create({
  baseURL: `${apiUrl}/api`,
  withCredentials: true,
});

export const loginJwt = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  //const res = await api.get('/auth/login');
  const res = "test";
  // If user has never logged in before, redirect to consent screen
  if (res.status === 210) {
    window.location = res.data;
  }
};
