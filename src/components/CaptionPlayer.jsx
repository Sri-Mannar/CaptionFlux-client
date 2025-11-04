// src/components/CaptionPlayer.jsx
import React, { useEffect, useRef, useState } from "react";

export default function CaptionPlayer({ blobUrl, audioPath }) {
  const videoRef = useRef(null);
  const [segments, setSegments] = useState([]);
  const [currentCaption, setCurrentCaption] = useState("");
  const wsRef = useRef(null);

  // Connect WebSocket once audioPath is available
  useEffect(() => {
    if (!audioPath) return;

    const ws = new WebSocket("ws://localhost:8000/ws/transcribe");
    wsRef.current = ws;
    setSegments([]);

    ws.onopen = () => {
      ws.send(JSON.stringify({ audio_path: audioPath }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.done) {
        ws.close();
        return;
      }
      if (data.error) {
        console.error("WS error:", data.error);
        return;
      }
      setSegments((prev) => [...prev, data]);
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);
    ws.onclose = () => console.log("WebSocket closed");

    return () => ws.close();
  }, [audioPath]);

  // Sync captions with playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const interval = setInterval(() => {
      const t = video.currentTime;
      const seg = segments.find((s) => t >= s.start && t <= s.end);
      setCurrentCaption(seg ? seg.text : "");
    }, 300);

    return () => clearInterval(interval);
  }, [segments]);

  if (!blobUrl && !audioPath)
    return (
      <p className="text-gray-400 text-center mt-6">
        Upload a file or provide a link to get started.
      </p>
    );

  return (
    <div className="w-full mt-8 flex flex-col items-center">
      {blobUrl ? (
        <div className="relative w-full max-w-[720px] aspect-video bg-[#101723] rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={blobUrl}
        controls
        className="absolute inset-0 w-full h-full object-contain rounded-lg"
      />
    </div>
      ) : (
        <div>
            <audio
          ref={videoRef}
          src={`http://localhost:8000/${audioPath}`}
          controls
          className="w-full max-w-[720px]"
        />
        </div>
        
      )}

      <div className="mt-4 bg-[#223149] text-white rounded-lg px-6 py-3 text-lg min-h-[56px] w-full max-w-[720px] text-center">
        {currentCaption || "Listening... captions will appear here."}
      </div>
    </div>
  );
}
