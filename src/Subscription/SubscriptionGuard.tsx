import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './subscription-guard.css';

interface SubscriptionGuardProps {
    children: React.ReactNode;
}

const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({ children }) => {
    const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkSubscription = async () => {
            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username'); // Ensure the username is stored on login

            if (!token || !username) {
                navigate('/login'); // Redirect to login if not logged in
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8080/api/subscriptions/check`, {
                    params: { username },
                    headers: { Authorization: token },
                });
                setIsSubscribed(response.data);
            } catch (error) {
                console.error('Error checking subscription:', error);
                setIsSubscribed(false); // Default to unsubscribed if an error occurs
            }
        };

        checkSubscription();
    }, [navigate]);

    if (isSubscribed === null) {
        return <p>Loading...</p>
    }

    if (!isSubscribed) {
        return (
            <div className="subscription-guard">
                <h2>Subscribe to Access</h2>
                <p>You need an active subscription to view this content.</p>
                <button onClick={() => navigate('/checkout')}>Get Subscription</button>
            </div>
        );
    }

    return <>{children}</>
};

export default SubscriptionGuard;