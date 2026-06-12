import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
// Features
import Register from './features/public/Register';
import Donate from './features/public/Donate';
import RequestAid from './features/public/RequestAid';
import Timeline from './features/public/Timeline';
import AdminGuard from './components/AdminGuard'; 
import Home from './features/public/Home';
import Council from './features/public/Council';
import Associates from './features/public/Associates';
import Terms from './features/public/Terms';
import Contact from './features/public/Contact';
import Vision from './features/public/Vision';
// Use only the lazy version
const Dashboard = lazy(() => import('./features/admin/Dashboard'));

function App() {
  return (
    <Router>
      <Navbar /> {/* Place it here */}
      <Routes>
       <Route path="/" element={<Home />} />

        <Route path="/register" element={<Register />} />

        <Route path="/donate" element={<Donate />} />

        <Route path="/request-aid" element={<RequestAid />} />

        <Route path="/timeline" element={<Timeline />} />

        <Route path="/council" element={<Council />} />

        <Route path="/associates" element={<Associates />} />

        <Route path="/terms" element={<Terms />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/vision" element={<Vision />} />

        {/* Admin Route fixed syntax */}

        <Route path={import.meta.env.VITE_VISION_PATH} element={

          <Suspense fallback={<div>Loading...</div>}>

            <AdminGuard>

              <Dashboard />

            </AdminGuard>

          </Suspense>

        } />

      
      </Routes>
    </Router>
  );
}

export default App;