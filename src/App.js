// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
// import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#101723]">
        <Navbar />

        <Routes>
          {/* <Route path="/" element={<LoginPage />} /> */}
          <Route path="/" element={<HomePage />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}
