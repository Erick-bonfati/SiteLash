import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Componentes
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Appointment from './pages/Appointment';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Context
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main style={{ minHeight: 'calc(100vh - 200px)' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/agendamento" element={<Appointment />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            toastStyle={{
              backgroundColor: '#ffffff',
              color: '#4a4a4a',
              border: '1px solid #f8b5c1'
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
