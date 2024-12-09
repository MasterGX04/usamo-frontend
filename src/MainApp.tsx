import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './HomeScreen';
import MathPageWrapper from './MathSections/MathPageWrapper';
import Navbar from './Navbar';
import Signup from './pages/Signup';
import Login from './LoginComponents/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import SubscriptionGuard from './Subscription/SubscriptionGuard';
import DiscussionBoard from './PostComponents/DiscussionBoard';
import Checkout from './pages/Checkout';
import './main-app.css';

const MainApp: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const [blurEffect, setBlurEffect] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        setIsLoggedIn(!!token);
        setUsername(username || '');
    });
    
    return (
        <div className="app-container">
            <Router>
                <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setBlurEffect={setBlurEffect} />
                <div className={`content-container ${blurEffect ? 'blur' : ''}`}>
                    <Routes>
                        <Route path="/" element={<HomeScreen />} />
                        <Route path="/mathpage/:mathType" element={<MathPageWrapper />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/discussion-board" element={<DiscussionBoard currentUser={username} />} />
                    </Routes>
                </div>
            </Router>
        </div>
    );
}

export default MainApp;