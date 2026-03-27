import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface AuthUser {
  userId: string;
  email: string;
  fullName?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple JWT decoding (base64)
const peekJwt = (token: string): any => {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
};

// API base URL - thay đổi theo environment của bạn
const API_BASE_URL = 'https://queuemanagement-hjaj.onrender.com/api';

// Tạo axios instance với interceptor để tự động gắn token
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor để tự động thêm token vào header
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Hàm lấy thông tin user từ API
  const fetchUserInfo = async (userId: string, token: string): Promise<AuthUser | null> => {
    try {
      const response = await apiClient.get(`https://queuemanagement-hjaj.onrender.com/api/v1/users/${userId}`);
      const userData = response.data;
       console.log('response:', response); // Debug log
      console.log('User data from API:', userData); // Debug log
      
      return {
        userId: userData.Id,
        email: userData.email || userData.Email || '',
        fullName: userData.fullName || userData.FullName || userData.name || '',
      };
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      console.log('userId',userId); // Debug log
      // Nếu API fail, vẫn dùng thông tin từ JWT
      const decoded = peekJwt(token);
      return {
        userId: userId,
        email: decoded?.email || decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '',
        fullName: decoded?.name || decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '',
      };
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const decoded = peekJwt(token);
        if (decoded) {
          // Lấy userId từ JWT
          const userId = decoded.sub || 
                        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || 
                        decoded.nameid;
          
          if (userId) {
            // Gọi API lấy thông tin chi tiết user
            const userInfo = await fetchUserInfo(userId, token);
            console.log('Final user info:', userInfo); // Debug log
            setUser(userInfo);
          } else {
            // Fallback nếu không có userId trong JWT
            setUser({
              userId: '',
              email: decoded.email || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '',
              fullName: decoded.name || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '',
            });
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (token: string) => {
    localStorage.setItem('accessToken', token);
    const decoded = peekJwt(token);
    
    if (decoded) {
      const userId = decoded.sub || 
                    decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || 
                    decoded.nameid;
      
      if (userId) {
        // Gọi API lấy thông tin user chi tiết
        const userInfo = await fetchUserInfo(userId, token);
        setUser(userInfo);
      } else {
        // Fallback
        setUser({
          userId: '',
          email: decoded.email || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '',
          fullName: decoded.name || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '',
        });
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  if (loading) {
    // Có thể return loading spinner nếu muốn
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};