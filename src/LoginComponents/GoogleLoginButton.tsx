import React from "react";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import './google-login.css';
import { useNavigate } from "react-router-dom";

interface GoogleLoginProps {
    fullBirthday: string;
}

const GoogleLoginButton: React.FC<GoogleLoginProps> = ({ fullBirthday }) => {
    const navigate = useNavigate();
    const login = useGoogleLogin({
        flow: 'implicit',
        onSuccess: async (tokenResponse) => {
            try {
                const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                });

                const user = userInfo.data;
                console.log('User:', userInfo);
                // Send user data to backend for signup/login
                const response = await axios.post('http://localhost:8080/api/users/google-signup-login', {
                    email: user.email,
                    username: user.name,
                    birthday: fullBirthday || null,
                });

                console.log('Google login successful:', response.data);
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("username", response.data.username);
                navigate('/');
            } catch (error) {
                console.error('Error during Google login:', error);
            }
        },
        onError: (error) => console.error('Google Login Failed', error),
    });

    return (
        <button onClick={() => login()} className="google-button">
            <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png" 
                alt="Google logo" 
                className="google-logo" 
            />
            <span>Sign up / Login with Google</span>
        </button>
    );
};

export default GoogleLoginButton;