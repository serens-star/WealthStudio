// import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideBar from "./components/SideBar";
import MobileNav from "./components/MobileNav";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import MoneySnapshot from "./pages/MoneySnapshot/MoneySnapshot";
import StrategyTracks from "./pages/StrategyTracks/StrategyTracks";
import KnowYourMoney from "./pages/KnowYourMoney/KnowYourMoney";
import ExplaineryLayer from "./pages/ExplaineryLayer/ExplaineryLayer";
import Profile from "./pages/Profile/Profile";
import "./App.css";

function ProtectedLayout() {
  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <SideBar />
      </aside>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<MoneySnapshot />} />
          <Route path="/tracks" element={<StrategyTracks />} />
          <Route path="/simulate" element={<KnowYourMoney />} />
          <Route path="/learn" element={<ExplaineryLayer />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <nav className="app-mobile-nav">
        <MobileNav />
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
