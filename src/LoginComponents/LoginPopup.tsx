import React from "react";
import { useNavigate } from "react-router-dom";
import './login-popup.css';

interface LoginPopupProps {
    setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginPopup: React.FC<LoginPopupProps> = ({ setShowPopup }) => {
    const navigate = useNavigate();

    const handleLogin = () => {
        setShowPopup(false);
        navigate('/login');
    };

    return (
        <div className="login-popup-container">
            <div className="login-popup">
                <h2>Please Log In</h2>
                <p>You must be logged in to create a post.</p>
                <div className="popup-buttons">
                    <button className="popup-login-button" onClick={handleLogin}>
                        Log In
                    </button>
                    <button className="popup-cancel-button" onClick={() => setShowPopup(false)}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPopup;