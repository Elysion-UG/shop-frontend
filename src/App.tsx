// App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import PageLayout from './components/PageLayout.tsx';
import { Leaf } from 'lucide-react';

import EmailVerification from "./pages/EmailVerificationPage.tsx";
import Onboarding from "./pages/OnboardingPage.tsx";
import About from "./pages/AboutPage.tsx";
import Contact from "./pages/ContactPage.tsx";
import SustainableShop from "./pages/ShopPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";

function ProductPage() {
  return null;
}

function App() {
  return (
    <PageLayout
      title="ELYSION"
      logo={<Leaf className="w-8 h-8 text-green-600" />}
    >
      <Routes>
        <Route
          path="/"
          element={
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-800 mb-4">Page Content Area</h2>
              <p className="text-green-600">This is where you can add any components you want!</p>
            </div>
          }
        />

        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/shop" element={<SustainableShop />} />

        {/* Login & Onboarding */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<Onboarding />} />
        {/* /signin alias → redirect auf /login */}
        <Route path="/signin" element={<Navigate to="/login" replace />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="product/:id" element={<ProductPage />} />
      </Routes>
    </PageLayout>
  );
}

export default App;
