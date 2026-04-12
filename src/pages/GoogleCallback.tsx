// // GoogleCallback.tsx
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";

// const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const GoogleCallback = () => {
//     const navigate = useNavigate();
//     const { login } = useAuth();

//     useEffect(() => {
//         const urlParams = new URLSearchParams(window.location.search);
//         const code = urlParams.get("code");

//         if (!code) {
//             navigate("/login");
//             return;
//         }

//         const fetchGoogleLogin = async () => {
//             try {
//                 const response = await fetch(
//                     `${VITE_API_BASE_URL}/auth/google-callback`,  // ✅ Không cần query param
//                     {
//                         method: "POST",
//                         headers: { "Content-Type": "application/json" },
//                         body: JSON.stringify({ code })
//                     }
//                 );

//                 if (!response.ok) {
//                     throw new Error("Google login failed");
//                 }

//                 const data = await response.json();
//                 console.log("Google login response:", data);
//                 const token =data.accessToken || data.AccessToke;  
//                 const refreshToken =  data.RefreshToken;

//                 if (token) {
//                     await login(token, refreshToken);
//                 }

//                 navigate("/kiosk"); // hoặc role-based
//             } catch (error) {
//                 console.error(error);
//                 navigate("/login");
//             }
//         };

//         fetchGoogleLogin();
//     }, []);

//     return (
//         <div className="flex items-center justify-center h-screen">
//             <p>Đang xử lý đăng nhập Google...</p>
//         </div>
//     );
// };


// export default GoogleCallback;
// GoogleCallback.tsx
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
 // Import axios instance

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const GoogleCallback = () => {
    const navigate = useNavigate();
    const { fetchUserInfo, setUser } = useAuth(); // Thêm fetchUserInfo và setUser
    const hasFetched = useRef(false);

    useEffect(() => {
        // Ngăn chặn React StrictMode thực thi API 2 lần dẫn đến lỗi invalid_grant
        if (hasFetched.current) return;
        hasFetched.current = true;

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (!code) {
            navigate("/login");
            return;
        }

        const fetchGoogleLogin = async () => {
            try {
                const response = await fetch(
                    `${VITE_API_BASE_URL}/auth/google-callback`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ code }),
                        credentials: "include" // ✅ QUAN TRỌNG: Cho phép gửi/nhận cookie
                    }
                );

                if (!response.ok) {
                    const errorData = await response.text();
                    throw new Error(`Google login failed: ${response.status} - ${errorData}`);
                }

                const data = await response.json();
                console.log("Google login response:", data);
                
                // ✅ Backend đã set cookie qua response, không cần lưu token ở FE
                // Chỉ cần fetch user info
                const userInfo = await fetchUserInfo();
                if (userInfo) {
                    setUser(userInfo);
                    console.log("User info:", userInfo);
                }
                
                navigate("/kiosk");
            } catch (error) {
                console.error("Google login error:", error);
                navigate("/login");
            }
        };

        fetchGoogleLogin();
    }, [navigate, fetchUserInfo, setUser]);

    return (
        <div className="flex items-center justify-center h-screen">
            <p>Đang xử lý đăng nhập Google...</p>
        </div>
    );
};

export default GoogleCallback;