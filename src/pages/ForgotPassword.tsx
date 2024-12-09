import React, { useState} from 'react';
import axios from 'axios';
import './forgot-password.css';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.post('http://localhost:8080/api/users/forgot-password', { email });
            setMessage(response.data.message);
        } catch(error: any) {
            setError(error.response?.data || 'An error occured');
        }
    }

    return (
        <div className="forgot-password-container">
             <div className="forgot-password-box">
                <h2>Forgot your password?</h2>
                <p className="instruction-text">
                    Insert your email to get a reset link!
                </p>
                <form className="forgot-password-form" onSubmit={handleForgotPassword}>
                    <label>Email</label>
                    <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className="send-button">Send</button>
                    {message && <p className="success-message">{message}</p>}
                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;