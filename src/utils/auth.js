export const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

export const getUserRole = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const decoded = parseJwt(token);
  return decoded ? decoded.role : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};
