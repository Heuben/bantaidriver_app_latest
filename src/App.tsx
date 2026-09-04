import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp } from './contexts/AppContext';
import { ConnectionProvider } from './contexts/ConnectionContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { SplashScreen } from './components/SplashScreen';
import { AuthScreen } from './pages/AuthScreen';
import { SessionScreen } from './pages/SessionScreen';
import { IncidentScreen } from './pages/IncidentScreen';
import { CommsScreen } from './pages/CommsScreen';
import { HardwareScreen } from './pages/HardwareScreen';
import { ProfileScreen } from './pages/ProfileScreen';
import { SettingsScreen } from './pages/SettingsScreen';

export function App() {
  return (
    <AppProvider>
      <ConnectionProvider>
        <NotificationProvider>
          <Shell />
        </NotificationProvider>
      </ConnectionProvider>
    </AppProvider>);

}

function Shell() {
  const { dark } = useApp();
  const [booting, setBooting] = useState(true);

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="bantai-aurora min-h-screen w-full bg-[#F4F4F7] font-sf text-black transition-colors duration-200 ease-ios dark:bg-[#07070A] dark:text-white">
        <main className="mx-auto flex min-h-screen w-full items-center justify-center px-6 py-10">
          <AnimatePresence mode="wait">
            {booting ?
            <motion.div
              key="splash"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}>

                <SplashScreen onDone={() => setBooting(false)} />
              </motion.div> :

            <motion.div
              key="app"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}>

                <Screen />
              </motion.div>
            }
          </AnimatePresence>
        </main>
      </div>
    </div>);

}

function Screen() {
  const { module } = useApp();

  switch (module) {
    case 'auth':
      return <AuthScreen />;
    case 'incident':
      return <IncidentScreen />;
    case 'comms':
      return <CommsScreen />;
    case 'hardware':
      return <HardwareScreen />;
    case 'profile':
      return <ProfileScreen />;
    case 'settings':
      return <SettingsScreen />;
    case 'session':
    default:
      return <SessionScreen />;
  }
}