import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext'; // <-- Import added
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/home/Hero';
import ExploreModels from './components/home/ExploreModels';
import AboutSection from './components/home/AboutSection';
import PageLoader from './components/ui/PageLoader';
import ProductDetails from './pages/ProductDetails';
import AllModels from './pages/AllModels';
import NotFound from './pages/NotFound';

const Home = () => {
  return (
    <div className="flex flex-col">
      <Hero />
      <ExploreModels />
      <AboutSection />
    </div>
  );
};

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-color)] pb-16 md:pb-0">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  const [showSplash, setShowSplash] = useState(window.location.pathname === '/');

  if (showSplash) {
    return (
      <ThemeProvider>
        <PageLoader onComplete={() => setShowSplash(false)} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <SocketProvider> {/* <-- Socket Provider Wrapper Added */}
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/models" element={<AllModels />} />
              <Route path="/models/:id" element={<ProductDetails />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </ThemeProvider>
  );
}

export default App;