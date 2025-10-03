
import axios from 'axios';

const base = String(import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/,'');
const api = axios.create({ baseURL: `${base}/api/v1`, timeout: 10000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  config.headers = config.headers || {};
  if (token) config.headers.Authorization = `Bearer ${token}`;
    config.headers['Authorization'] = token;
    
  return config;
});


export async function getAll() {
  const { data } = await api.get('/blueprints');
  return data;
}

export async function getByAuthor(author) {
  const { data } = await api.get(`/blueprints/${encodeURIComponent(author)}`);
  return data;
}

export async function getByAuthorAndName(author, name) {
  const { data } = await api.get(`/blueprints/${encodeURIComponent(author)}/${encodeURIComponent(name)}`);
  return data;
}

export async function create(blueprint ) {
  const { data } = await api.post('/blueprints', blueprint);
  return data;
}




const raw = axios.create({
  baseURL: base,
  timeout: 10000,
});
export default raw;

