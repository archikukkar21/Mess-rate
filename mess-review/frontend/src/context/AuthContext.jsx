import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('messreview_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('messreview_token');
    if (token) {
      api.get('/auth/me')
        .then(res => setUser(res.data.user))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (uid, password) => {
    const { data } = await api.post('/auth/login', { uid, password });
    localStorage.setItem('messreview_token', data.token);
    localStorage.setItem('messreview_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const signup = async (formData) => {
    const { data } = await api.post('/auth/signup', formData);
    localStorage.setItem('messreview_token', data.token);
    localStorage.setItem('messreview_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('messreview_token');
    localStorage.removeItem('messreview_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
