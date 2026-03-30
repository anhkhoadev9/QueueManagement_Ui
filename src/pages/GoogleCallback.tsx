// GoogleCallback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const GoogleCallback = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (!code) {
            navigate("/login");
            return;
        }

        const fetchGoogleLogin = async () => {
            try {
                const response = await fetch(
                    `${VITE_API_BASE_URL}/auth/google-callback`,  // ✅ Không cần query param
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ code })
                    }
                );

                if (!response.ok) {
                    throw new Error("Google login failed");
                }

                const data = await response.json();

                const token =
                    data.accessToken || data.AccessToken || data.token;

                if (token) {
                    await login(token);
                }

                navigate("/kiosk"); // hoặc role-based
            } catch (error) {
                console.error(error);
                navigate("/login");
            }
        };

        fetchGoogleLogin();
    }, []);

    return (
        <div className="flex items-center justify-center h-screen">
            <p>Đang xử lý đăng nhập Google...</p>
        </div>
    );
};


export default GoogleCallback;