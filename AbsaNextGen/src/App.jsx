import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import SideBar from "./components/SideBar";
import MobileNav from "./components/MobileNav";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import MoneySnapshot from "./pages/MoneySnapshot/MoneySnapshot";
import StrategyTracks from "./pages/StrategyTracks/StrategyTracks";
import KnowYourMoney from "./pages/KnowYourMoney/KnowYourMoney";
import ExplaineryLayer from "./pages/ExplaineryLayer/ExplaineryLayer";
import Profile from "./pages/Profile/Profile";
import Landing from "./pages/Landing/Landing";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import Onboarding from "./pages/Onboarding/Onboarding";
import "./App.css";

function ProtectedLayout({ onLogout }) {
  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <SideBar onLogout={onLogout} />
      </aside>
      <main className="app-main">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<MoneySnapshot />} />
            <Route path="/tracks" element={<StrategyTracks />} />
            <Route path="/simulate" element={<KnowYourMoney />} />
            <Route path="/learn" element={<ExplaineryLayer />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <nav className="app-mobile-nav">
        <MobileNav />
      </nav>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("currentUser")
  );

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onLogin={handleLogin} />} />
        <Route path="/landing" element={<Landing />} />
        <Route
          path="/onboarding"
          element={isLoggedIn ? <Onboarding /> : <Landing />}
        />
        <Route
          path="/*"
          element={
            isLoggedIn ? (
              <ProtectedLayout onLogout={handleLogout} />
            ) : (
              <Landing />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
