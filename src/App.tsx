// src/App.tsx
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PageLayout from './components/PageLayout.tsx';
import { Leaf } from 'lucide-react';

import EmailVerification from "./pages/EmailVerificationPage.tsx";
import Onboarding from "./pages/OnboardingPage.tsx";
import About from "./pages/AboutPage.tsx";
import Contact from "./pages/ContactPage.tsx";
import SustainableShop from "./pages/ShopPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";

type StoredUser = { firstName?: string; lastName?: string; email?: string };

function ProductPage() { return null; }

export default function App() {  // <-- default export present
  const [user, setUser] = useState<StoredUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = () => {
      const raw = localStorage.getItem('user');
      setUser(raw ? JSON.parse(raw) : null);
    };
    load();
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'user' || e.key === 'accessToken') load();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/', { replace: true });
  };

  const headerActions = user ? (
    <div className="flex items-center gap-3">
      <span className="text-green-800">Hallo, {user.firstName || user.email}</span>
      <button onClick={logout} className="inline-flex items-center rounded-md border border-green-300 px-3 py-1.5 text-sm text-green-800 hover:bg-green-50">
        Logout
      </button>
    </div>
  ) : (
    <Link to="/login" className="inline-flex items-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700">
      Sign in
    </Link>
  );

  return (
    <PageLayout title="ELYSION" logo={<Leaf className="w-8 h-8 text-green-600" />} actions={headerActions}>
      <Routes>
        <Route path="/" element={
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-800 mb-4">Page Content Area</h2>
            <p className="text-green-600">This is where you can add any components you want!</p>
          </div>
        }/>
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/shop" element={<SustainableShop />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/signin" element={<Navigate to="/login" replace />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="product/:id" element={<ProductPage />} />
      </Routes>
    </PageLayout>
  );
}