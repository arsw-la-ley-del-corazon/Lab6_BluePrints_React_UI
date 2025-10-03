import raw from './apiClient'; 

export async function login(username, password) {
  const { data } = await raw.post('/auth/login', { username, password }, {
    headers: { 'Content-Type': 'application/json' }
  });

  const token = data.access_token || data.token;
  const scheme = (data.token_type || 'Bearer').trim();
  const authHeader = `${/bearer/i.test(scheme) ? 'Bearer' : scheme} ${token}`;
  localStorage.setItem('token', authHeader); 
  return data;
}
