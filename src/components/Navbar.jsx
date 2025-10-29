import React from "react";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between border-b border-[#223149] px-8 sm:px-10 py-3">
      <div className="flex items-center gap-3 text-white">
        <div className="w-5 h-5 text-white">
          <svg viewBox="0 0 48 48" fill="none">
            <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" />
          </svg>
        </div>
        <h2 className="text-lg font-bold tracking-tight">CaptionFlux</h2>
      </div>

      <div className="hidden md:flex items-center gap-10">
        <a href="/" className="text-sm font-medium hover:text-[#3c83f6] transition">Features</a>
        <a href="/" className="text-sm font-medium hover:text-[#3c83f6] transition">Pricing</a>
        <a href="/" className="text-sm font-medium hover:text-[#3c83f6] transition">Support</a>
        <button className="h-10 px-4 bg-[#3c83f6] text-white text-sm font-bold rounded-lg hover:brightness-110 transition">
          Get Started
        </button>
      </div>
    </header>
  );
}
