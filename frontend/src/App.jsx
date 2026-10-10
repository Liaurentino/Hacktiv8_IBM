import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              borderRadius: '14px',
              fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
              fontSize: '13px',
              boxShadow: '0 8px 24px rgba(47, 51, 102, 0.12)'
            }
          }}
        />
      </NotificationProvider>
    </AuthProvider>
  );
}
