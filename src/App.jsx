import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route,Navigate} from 'react-router-dom';
import SecureTransfer from './components/SecureTransfer';
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
import EnrollAgent from './features/admin/EnrollAgent';
import TransferAid from './components/TransferAid';
import AccessPortal from './features/public/AccessPortal';
import AdminEntryPortal from './features/admin/AdminEntryPortal';
// Use only the lazy version
const Dashboard = lazy(() => import('./features/admin/Dashboard'));
function App() {
  return (
    <Router>
      <Navbar /> {/* Place it here */}
      <Routes>
       <Route path="/" element={<Home />} />
       <Route path={import.meta.env.VITE_SECRET_TRANSFER_PATH} element={<AccessPortal />} />
       {/* Protected Admin Routes */}
        <Route path="/transferaid" element={
          <AdminGuard><TransferAid /></AdminGuard>
        } />
        <Route path="/enrollment" element={
          <AdminGuard><EnrollAgent /></AdminGuard>
        } />
        <Route path="/securetransfer" element={
          <AdminGuard><SecureTransfer /></AdminGuard>
        } />
        <Route path="/admin-login" element={
          <AdminGuard><AdminEntryPortal /></AdminGuard>} />

        <Route path="/register" element={<Register />} />

        <Route path="/donate" element={<Donate />} />

        <Route path="/request-aid" element={<RequestAid />} />

        <Route path="/timeline" element={<Timeline />} />

        <Route path="/council" element={<Council />} />

        <Route path="/associates" element={<Associates />} />

        <Route path="/terms" element={<Terms />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/vision" element={<Vision />} />

        <Route path={import.meta.env.VITE_VISION_PATH} element={

          <Suspense fallback={<div>Loading...</div>}>

            <AdminGuard>

              <Dashboard />

            </AdminGuard>

          </Suspense>

        } />
<Route path="*" element={<Navigate to="/" />} />
      
      </Routes>
    </Router>
  );
}

export default App;