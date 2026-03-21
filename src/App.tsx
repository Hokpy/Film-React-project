import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { ComparisonBar } from './components/ComparisonBar';
import { HomePage } from './pages/HomePage';
import { MovieDetailPage } from './pages/MovieDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ComparePage } from './pages/ComparePage';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ErrorBoundary>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movie/:id" element={<MovieDetailPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/compare" element={<ComparePage />} />
          </Routes>
          {/* Плавающая панель сравнения — видна на всех страницах */}
          <ComparisonBar />
        </ErrorBoundary>
      </AppProvider>
    </BrowserRouter>
  );
}
