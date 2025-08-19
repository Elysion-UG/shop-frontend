// App.tsx
import { Routes } from 'react-router-dom';
import PageLayout from './components/PageLayout.tsx';  // Vergewissere dich, dass der Pfad stimmt!
import { Route } from 'react-router-dom';  // Richtiges Import für Route
import { Leaf } from 'lucide-react';
import EmailVerification from "./pages/EmailVerificationPage.tsx";
import Onboarding from "./pages/OnboardingPage.tsx";
import About from "./pages/AboutPage.tsx";
import Contact from "./pages/ContactPage.tsx";
import SustainableShop from "./pages/ShopPage.tsx";

function ProductPage() {
    return null;
}

function App() {
    return (
        <PageLayout
            title="ELYSION v6"
            logo={<Leaf className="w-8 h-8 text-green-600" />}  // Das Logo als React-Komponente
        >
            <Routes>
                <Route path="/" element={
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-green-800 mb-4">Page Content Area</h2>
                        <p className="text-green-600">This is where you can add any components you want!</p>
                    </div>
                } />   {/* Home Seite */}
                <Route path="/email-verification" element={<EmailVerification />} />
                <Route path="/shop" element={<SustainableShop />} />
                <Route path="/signin" element={<Onboarding />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="product/:id" element={<ProductPage />} />
            </Routes>
        </PageLayout>
    );
}

export default App;
