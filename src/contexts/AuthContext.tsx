
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface AuthUser {
  userId: string;
  email: string;
  fullName?: string; 
  role?: string;
  phoneNumber?: string;
}

interface AuthContextType {
  user: AuthUser | null;
   login: (loginInfo: string, password: string) => Promise<void>
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  userRole: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Simple JWT decoding (base64)
// const peekJwt = (token: string): any => {
//   try {
//     const payload = token.split('.')[1];
//     const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
//     return JSON.parse(decoded);
//   } catch (e) {
//     return null;
//   }
// };

// // Hàm lấy role từ token
// const getRoleFromToken = (token: string): string | null => {
//   const decoded = peekJwt(token);
  
  
//   if (decoded) {
//     const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
//                  decoded['role'] ||
//                  decoded['Role'] ||
//                  null;
    
    
//     return role;
//   }
//   return null;
// };

// API base URL
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const VITE_API_BASE_URL = 'https://localhost:7164/api/v1';
// Tạo axios instance với interceptor để tự động gắn token
export const apiClient = axios.create({
  baseURL: VITE_API_BASE_URL,
   withCredentials: true,
});


// // Interceptor để tự động thêm token vào header
// apiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem('accessToken');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Interceptor để xử lý refresh token khi gặp lỗi 401
// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Nếu lỗi 401 và chưa thử refresh
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       const refreshToken = localStorage.getItem('refreshToken');

//       if (refreshToken) {
//         try {
//           // Gọi API refresh token - sử dụng Axios trực tiếp để tránh interceptor vòng lặp
//           const response = await axios.post(`${VITE_API_BASE_URL}/v1/auth/refresh-token`, {
//             refreshToken: refreshToken
//           });

//           const { AccessToken, RefreshToken } = response.data;

//           // Lưu token mới
//           localStorage.setItem('accessToken', AccessToken);
//           localStorage.setItem('refreshToken', RefreshToken);

//           // Cập nhật header cho request hiện tại và các request sau
//           apiClient.defaults.headers.common['Authorization'] = `Bearer ${AccessToken}`;
//           originalRequest.headers['Authorization'] = `Bearer ${AccessToken}`;

//           // Thực hiện lại request ban đầu
//           return apiClient(originalRequest);
//         } catch (refreshError) {
//           // Nếu refresh fail (token hết hạn thật sự), logout
//           console.error('Refresh token failed:', refreshError);
//           localStorage.removeItem('accessToken');
//           localStorage.removeItem('refreshToken');
//           window.location.href = '/login';
//           return Promise.reject(refreshError);
//         }
//       }
//     }

//     return Promise.reject(error);
//   }
// );


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Hàm lấy thông tin user từ API
  const fetchUserInfo = async (): Promise<AuthUser | null> => {
  try {
    // Không cần token, Cookie tự nhảy vào Request
    const response = await apiClient.get(`/auth/me`);
    const userData = response.data;
    console.log("Fetched user info:", userData);
    
 
    return {
      userId: userData.Id,
      email: userData.Email,
      fullName: userData.FullName,
      role: userData.Role,
    };
  } catch (error) {
    return null;
  }
};

 useEffect(() => {
  const initAuth = async () => {
    const userInfo = await fetchUserInfo();
    if (userInfo) {
       setUser(userInfo); // Valid! Load App...
          console.log("Fetched user infobew:", user);
    } else {
       setUser(null);     // Cookie thiu, vứt ra phòng Đăng Nhập
    }
    setLoading(false);
  };
  initAuth();
}, []);

  const login = async (loginInfo: string, password: string) => {
  try {
      await apiClient.post('/auth/login', {
      LoginInfo: loginInfo,
      Password: password
    });
    // Cookie đã được backend set, không cần làm gì thêm
    // Gọi fetchUserInfo để lấy thông tin user
    const userInfo = await fetchUserInfo();
    if (userInfo) {
      setUser(userInfo);
      console.log("Current user info:", userInfo);
    }
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

  // const logout = () => {
  //   localStorage.removeItem('accessToken');
  //   localStorage.removeItem('refreshToken');
  //   localStorage.removeItem('userRole');
  //   // localStorage.removeItem('userFullName');
  //   // localStorage.removeItem('userEmail');
  //   // localStorage.removeItem('userPhone');
  //   setUser(null);
  // };
 const logout = async () => {
  try {
    // Lấy refreshToken từ cookie
    const refreshToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('refreshToken='))
      ?.split('=')[1];
    
    // Gọi API logout với refreshToken trong body
    await apiClient.post('/auth/logout', { refreshToken });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    setUser(null);
  }
};

  const userRole = user?.role || null;
console.log("Current user role:", userRole);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading, userRole }}>
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