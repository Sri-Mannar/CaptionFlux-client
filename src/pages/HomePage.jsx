// src/pages/HomePage.jsx
import React, { useState } from "react";
import Hero from "../components/Hero";
import InputSelector from "../components/InputSelector";
import CaptionPlayer from "../components/CaptionPlayer";

export default function HomePage() {
  // 🧠 Include `videoId` in the state
  const [mediaData, setMediaData] = useState({
    blobUrl: null,
    audioPath: null,
    videoId: null,   // <-- IMPORTANT
  });

  return (
    <main className="flex-grow flex justify-center px-6 py-10">
      <div className="w-full max-w-[960px] flex flex-col items-center">
        <Hero />

        {/* InputSelector will now send { blobUrl, audioPath, videoId } */}
        <InputSelector onReady={(data) => setMediaData(data)} />

        {/* Pass videoId to CaptionPlayer */}
        <CaptionPlayer
          blobUrl={mediaData.blobUrl}
          audioPath={mediaData.audioPath}
          videoId={mediaData.videoId}   // <-- IMPORTANT
        />
      </div>
    </main>
  );
}
