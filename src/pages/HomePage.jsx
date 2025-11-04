// src/pages/HomePage.jsx
import React, { useState } from "react";
import Hero from "../components/Hero";
import InputSelector from "../components/InputSelector";
import CaptionPlayer from "../components/CaptionPlayer";

export default function HomePage() {
  // 🧠 State to hold media info returned from InputSelector
  const [mediaData, setMediaData] = useState({ blobUrl: null, audioPath: null });

  return (
    <main className="flex-grow flex justify-center px-6 py-10">
      <div className="w-full max-w-[960px] flex flex-col items-center">
        <Hero />
        {/* Pass setMediaData to InputSelector */}
        <InputSelector onReady={(data) => setMediaData(data)} />

        {/* Render CaptionPlayer once audio is ready */}
        <CaptionPlayer
          blobUrl={mediaData.blobUrl}
          audioPath={mediaData.audioPath}
        />
      </div>
    </main>
  );
}
