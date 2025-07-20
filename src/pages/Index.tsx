import React, { useEffect } from 'react';
import Dashboard from '@/components/admin/dashboard';
import InstallPrompt from '@/components/install-prompt';
import AnimatedBackground from '@/components/animated-background';

const Index = () => {
  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return (
    <>
      <AnimatedBackground />
      <Dashboard />
      <InstallPrompt />
    </>
  );
};

export default Index;
