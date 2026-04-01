// import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sideBar";
import MoneySnapshot from "./pages/moneySnapshot";
import StrategyTracks from "./pages/strategyTracks";
import SimulationLab from "./pages/knowYourMoney";
import LearnMore from "./pages/explaineryLayer";
import Profile from "./pages/profile";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<MoneySnapshot />} />
            <Route path="/Tracks" element={<StrategyTracks />} />
            <Route path="/Simulation" element={<SimulationLab />} />
            <Route path="/Learn" element={<LearnMore />} />
            <Route path="/Profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
