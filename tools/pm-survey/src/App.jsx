import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SurveyPage from './pages/SurveyPage';
import ThankYouPage from './pages/ThankYouPage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/survey" element={<SurveyPage />} />
          <Route path="/thankyou" element={<ThankYouPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
