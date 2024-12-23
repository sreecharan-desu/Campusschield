import { Routes, Route, BrowserRouter } from 'react-router-dom';
import HomePage from './pages/Homepage';
import Support from './pages/Support';
import Report from './pages/Report';
import Profile from './pages/Profile';
import Signin from './pages/Signin';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/create-report" element={<Report/>} />
                    <Route path="/profile" element={<Profile/>} />
                    <Route path="/signin" element={<Signin/>} />
                    <Route path="/signup" element={<Profile/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;