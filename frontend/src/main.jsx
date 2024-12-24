import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';
import App from './App.jsx';

const LoadingScreen = () => (
  <motion.div
    className="fixed inset-0 bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-600 flex flex-col items-center justify-center text-white"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 1 }}
  >
    {/* Logo Animation */}
    <motion.img
  src="/vite.svg"
  alt="Logo"
  className="h-16 w-16 mb-4"
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{
    duration: 1.5,
    ease: "easeInOut",
  }}
/>

    {/* Text Animation */}
    <motion.h1
      className="text-2xl font-bold"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
    >
      Campus Shield
    </motion.h1>
    <motion.p
      className="text-sm mt-2"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 1, ease: "easeOut" }}
    >
      Your OneStop Security solution.
    </motion.p>
  </motion.div>
);

const Root = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000); // Simulate loading delay
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading ? (
        <LoadingScreen key="loading" />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <App />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

createRoot(document.getElementById('root')).render(
  <RecoilRoot>
    <Root />
  </RecoilRoot>
);
