import React, { useState, useEffect, StrictMode } from 'react';
import axios from 'axios';
import { createRoot } from 'react-dom/client'
import './index.css'
import MainApp from './MainApp.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

const Root: React.FC = () => {
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
      const fetchClientId = async () => {
          try {
              const response = await axios.get('http://localhost:8080/api/users/google-client-id');
              setClientId(response.data.clientId);
          } catch (error) {
              console.error('Failed to fetch Google Client ID:', error);
          }
      };
      fetchClientId();
  }, []);

  if (!clientId) {
      return <div>Loading...</div>;
  }

  return (
      <GoogleOAuthProvider clientId={clientId}>
          <MainApp />
      </GoogleOAuthProvider>
  );
};
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Root />
  </StrictMode>,
)
