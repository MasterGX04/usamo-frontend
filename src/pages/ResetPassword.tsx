import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './reset-password.css';

const validatePassword = (password: string) => {
    const minLength = 8;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
    const upperCase = /[A-Z]/;
    const lowerCase = /[a-z]/;

    if (password.length < minLength) return 'Password must be at least 8 characters';
    if (!specialChar.test(password)) return 'Password must include a special character';
    if (!upperCase.test(password)) return 'Password must include an uppercase letter';
    if (!lowerCase.test(password)) return 'Password must include a lowercase letter';
    return '';
};

const ResetPassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        //Check if token is in URL
        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get('token');
        if (!token) {
            setError('Invalid or missing token');
        }
    }, [location.search]);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        const passwordError = validatePassword(newPassword);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get('token');

        try {
            await axios.post('http://localhost:8080/api/users/reset-password', {
                token,
                newPassword
            });
            setMessage("Password successfully reset! Redirecting...");
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error: any) {
            setError(error.response?.data || "An error occured");
        }
    }

    return (
        <div className="reset-password-container">
            <div className="reset-password-box">
            <h2>Reset Password</h2>
                <form className="reset-password-form" onSubmit={handleResetPassword}>
                    <label>New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    {error && <p className="error-message">{error}</p>}
                    {message && <p className="success-message">{message}</p>}
                    <button type="submit" className="reset-button">Reset Password</button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;