import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import './checkout.css';
import { useNavigate } from 'react-router-dom';

const Checkout: React.FC = () => {
    const [clientId, setClientId] = useState<string | null>(null);
    const [planId, setPlanId] = useState<string | null>(null);
    const navigate = useNavigate();

    // Fetch PayPal Client ID from the backend
    useEffect(() => {
        const fetchClientIdAndPlan = async () => {
            try {
                const clientResponse = await axios.get('http://localhost:8080/api/payments/client-id');
                setClientId(clientResponse.data.clientId);
                //console.log(`Client id: ${clientResponse.data.clientId}`);
                const planResponse = await axios.get('http://localhost:8080/api/payments/create-plan');
                setPlanId(planResponse.data.planId);
                //console.log(`Plan response: ${planResponse.data.planId}`);
            } catch (error) {
                console.error('Failed to fetch PayPal client ID:', error);
            }
        };

        fetchClientIdAndPlan();
    }, []);

    //Ensure user is logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    //handle PayPal payment approval
    const handleApproveSubscription = async (data: any) => {
        try {
            const token = localStorage.getItem("token");
            const subscriptionID = data.subscriptionID;
            const username = localStorage.getItem('username');
            //console.log(`Subscription id: ${subscriptionID}`);
            const response = await axios.post(
                'http://localhost:8080/api/payments/execute-subscription', null,
                { 
                    params: { subscriptionID: subscriptionID, username: username },
                    headers: { Authorization: `Bearer ${token}` },
                 }
                
            );

            console.log('Response:', response);

            if (response.status === 200) {
                console.log('Payment successful:', response.data);
                alert('Paymeent successful! Your subscription is now active.');
                navigate('/');
            } else {
                console.error('Payment confirmation failed:', response.data);
                alert('Payment confirmation failed. Please contact support.');
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                console.error('Error response from backend:', error.response.data);
                alert(`Payment failed: ${error.response.data.message}`);
            } else {
                console.error('Unknown error during payment confirmation:', error);
                alert('Payment failed. Please try again later.');
            }
        }
    };

    return (
        <div className="checkout-container">
            <h1>Checkout</h1>
            <p>Your subscription costs $0.99 per month.</p>
            {clientId && planId ? (
                <PayPalScriptProvider options={{ clientId: clientId, vault: true }}>
                    <PayPalButtons
                        createSubscription={(data, actions) => {
                            if (!planId) {
                                console.error('Plan ID is missing.');
                                return Promise.reject(new Error('Plan ID is missing.'));
                            }
                            return actions.subscription
                            .create({ plan_id: planId })
                            .catch((error) => {
                                console.error('Error creating subscription:', error);
                                throw error;
                            });
                        }}
                        onApprove={async (data) => {
                            console.log('Subscription approved:', data);
                            handleApproveSubscription(data);
                        }}
                        onError={(error) => console.error("Error during PayPal process:", error)}
                    />
                </PayPalScriptProvider>
            ) : (
                <p>Loading payment gateway...</p>
            )}
        </div>
    );
}

export default Checkout;