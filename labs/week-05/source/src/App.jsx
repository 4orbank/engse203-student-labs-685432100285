import { Routes, Route } from 'react-router-dom';
import AppLayout from './pages/AppLayout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import NewRequestPage from './pages/NewRequestPage.jsx';
import RequestDetailPage from './pages/RequestDetailPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="requests/new" element={<NewRequestPage />} />
        <Route path="requests/:requestId" element={<RequestDetailPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
