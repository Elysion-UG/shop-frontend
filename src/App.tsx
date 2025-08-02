// App.tsx
import { Routes } from 'react-router-dom';
import PageLayout from './components/PageLayout.tsx';  // Vergewissere dich, dass der Pfad stimmt!
import { Route } from 'react-router-dom';  // Richtiges Import für Route
import { Leaf } from 'lucide-react';
import EmailVerification from "./pages/EmailVerificationPage.tsx";  // Richtiges Import für Leaf


function App() {
    return (
        <PageLayout
            title="ELYSION"
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
            </Routes>
        </PageLayout>
    );
}

export default App;
