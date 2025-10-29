import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import InputSelector from "./components/InputSelector";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-[#101723]">
      <Navbar />
      <main className="flex-grow flex justify-center px-6 py-10">
        <div className="w-full max-w-[960px] flex flex-col items-center">
          <Hero />
          <InputSelector />
        </div>
      </main>
      <Footer />
    </div>
  );
}
