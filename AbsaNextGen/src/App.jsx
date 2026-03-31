import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sideBar";
import MoneySnapshot from "./pages/moneySnapshot";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MoneySnapshot />} />
      </Routes>
    </BrowserRouter>
  );
}
