import React, { useState } from 'react';
import axios from 'axios';
import GoogleLoginButton from './GoogleLoginButton';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';

interface LoginProps {
    setIsLoggedIn: (loggedIn: boolean) => void;
}

const Login: React.FC<LoginProps> = ({setIsLoggedIn}) => {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:8080/api/users/login', {
                usernameOrEmail,
                password,
            });
            const { token, username} = response.data;
            console.log('User logged in successfully:', response.data);
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
            setIsLoggedIn(true);
            navigate('/');
        } catch (error: any) {
            setError(error.response?.data || 'A login error occured');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
            <h2>Login to USAMO Guide</h2>
                <label>Username or Email</label>
                <input 
                    type="text"
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    required
                />

                <label>Password</label>
                <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <p className="error">{error}</p>}

                <button type="submit">Login</button>

                <p className="create-account-link">
                    <Link to='/signup'>Create account</Link>
                </p>
                <p className="forgot-password-link">
                    <Link to="/forgot-password">Forgot Password?</Link>
                </p>
            </form>

            <div className="google-login-wrapper">
                <GoogleLoginButton fullBirthday=''/> {/* No fullBirthday needed for login */}
            </div>
        </div>
    );
}

export default Login;