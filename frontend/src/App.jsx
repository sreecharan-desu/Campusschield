import { AnimatePresence,motion } from 'framer-motion';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import HomePage from './pages/Homepage';
import Profile from './pages/Profile';
import Report from './pages/Report';
import Support from './pages/Support';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminDashboard from './pages/Admin';
import AdminSignIn from './pages/AdminSIgnin';
import DocsWebsite from './pages/Docs';
import { RecoilRoot } from 'recoil';

function App() {
    return (
        <RecoilRoot>
        <BrowserRouter>
            <AnimatePresence mode="wait">
                <Routes>
                    <Route path="/" element={
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <HomePage />
                        </motion.div>
                    } />
                    <Route path="/signin" element={
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Signin />
                        </motion.div>
                    } />
                                        <Route path="/signup" element={
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Signup />
                        </motion.div>
                    } />
                                        <Route path="/create-report" element={
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Report />
                        </motion.div>
                    } />
                                                            <Route path="/profile" element={
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Profile />
                        </motion.div>
                    } />
                                                            <Route path="/support" element={
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Support />
                        </motion.div>
                    } />
                     <Route path="/admin/signin" element={
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <AdminSignIn />
                        </motion.div>
                    } />
                                         <Route path="/admin/dashboard" element={
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <AdminDashboard />
                        </motion.div>
                    } />


<Route path="/docs" element={
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <DocsWebsite/>
                        </motion.div>
                    } />
                </Routes>
            </AnimatePresence>
        </BrowserRouter>
        </RecoilRoot>
    );
}

// Create a PageWrapper component for reuse
const PageWrapper = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.5 }}
    >
        {children}
    </motion.div>
);

export default App;