// src/components/CaptionPlayer.jsx
import React, { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";

export default function CaptionPlayer({ blobUrl, audioPath, videoId }) {
  const mediaRef = useRef(null);
  const wsRef = useRef(null);
  const playerRef = useRef(null);

  const [segments, setSegments] = useState([]);
  const [currentCaption, setCurrentCaption] = useState("");

  // Determine playback type
  const isYouTube = !!videoId; // TRUE if YouTube link was used

  // ---- Connect WebSocket WHEN audioPath is available ----
  useEffect(() => {
    if (!audioPath) return;

    const ws = new WebSocket("ws://localhost:8000/ws/transcribe");
    wsRef.current = ws;
    setSegments([]);
    setCurrentCaption("");

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
        console.error("WS Error:", data.error);
        return;
      }

      setSegments((prev) => [...prev, data]);
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);
    ws.onclose = () => console.log("WebSocket closed");

    return () => ws.close();
  }, [audioPath]);

  // ---- Sync captions dynamically ----
  useEffect(() => {
    const interval = setInterval(() => {
      let currentTime = 0;

      if (isYouTube && playerRef.current?.getCurrentTime) {
        currentTime = playerRef.current.getCurrentTime();
      } else if (mediaRef.current) {
        currentTime = mediaRef.current.currentTime;
      }

      const seg = segments.find(
        (s) => currentTime >= s.start && currentTime <= s.end
      );

      setCurrentCaption(seg ? seg.text : "");
    }, 250);

    return () => clearInterval(interval);
  }, [segments, isYouTube]);

  // ---- YouTube player ready ----
  const onYouTubeReady = (event) => {
    playerRef.current = event.target;
    playerRef.current.playVideo();
  };

  // ---- No media yet ----
  if (!blobUrl && !audioPath && !videoId)
    return (
      <p className="text-gray-400 text-center mt-6">
        Upload a file or paste a YouTube link to get started.
      </p>
    );

  return (
    <div className="w-full mt-8 flex flex-col items-center">
      {/* ---- YOUTUBE MODE ---- */}
      {isYouTube ? (
        <div className="relative w-full max-w-[720px] aspect-video bg-black rounded-lg overflow-hidden">
          <YouTube
            videoId={videoId}
            opts={{
              width: "100%",
              height: "100%",
              playerVars: { autoplay: 1, controls: 1 },
            }}
            onReady={onYouTubeReady}
            className="absolute inset-0 w-full h-full"
          />
        </div>
      ) : blobUrl ? (
        /* ---- FILE UPLOAD MODE (VIDEO) ---- */
        <div className="relative w-full max-w-[720px] aspect-video bg-[#101723] rounded-lg overflow-hidden">
          <video
            ref={mediaRef}
            src={blobUrl}
            controls
            className="absolute inset-0 w-full h-full object-contain rounded-lg"
          />
        </div>
      ) : (
        /* ---- FILE UPLOAD MODE (AUDIO) ---- */
        <audio
          ref={mediaRef}
          src={`http://localhost:8000/${audioPath}`}
          controls
          className="w-full max-w-[720px]"
        />
      )}

      {/* ---- Captions Display ---- */}
      <div className="mt-4 bg-[#223149] text-white rounded-lg px-6 py-3 text-lg min-h-[56px] w-full max-w-[720px] text-center">
        {currentCaption || "Listening... captions will appear here."}
      </div>
    </div>
  );
}
