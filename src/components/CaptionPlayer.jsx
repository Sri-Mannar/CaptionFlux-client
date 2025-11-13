// src/components/CaptionPlayer.jsx
import React, { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";

export default function CaptionPlayer({ blobUrl, audioPath, videoId }) {
  const mediaRef = useRef(null);
  const playerRef = useRef(null);
  const wsRef = useRef(null);

  const [segments, setSegments] = useState([]);
  const [currentCaption, setCurrentCaption] = useState("");
  const [readyToPlay, setReadyToPlay] = useState(false);

  const isYouTube = !!videoId;

  // ---- Connect WebSocket WHEN audioPath is available ----
  useEffect(() => {
    if (!audioPath) return;

    const ws = new WebSocket("ws://localhost:8000/ws/transcribe");
    wsRef.current = ws;
    setSegments([]);
    setCurrentCaption("");
    setReadyToPlay(false); // reset state on new media

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

      setSegments((prev) => {
        const updated = [...prev, data];

        // ⭐ BUFFER LOGIC: Wait until 3 chunks
        if (updated.length >= 3) {
          setReadyToPlay(true);
        }

        return updated;
      });
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);
    ws.onclose = () => console.log("WebSocket closed");

    return () => ws.close();
  }, [audioPath]);

  // ---- Sync captions dynamically ----
  useEffect(() => {
    const interval = setInterval(() => {
      if (!readyToPlay) return;

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
  }, [segments, readyToPlay, isYouTube]);

  // ---- YouTube ready ----
  const onYouTubeReady = (event) => {
    playerRef.current = event.target;
    // Do not autoplay until buffering is ready
    if (readyToPlay) {
      playerRef.current.playVideo();
    }
  };

  // ---- If buffering, show loader ----
  if (!readyToPlay) {
    return (
      <div className="mt-10 text-center text-[#90a7cb] text-lg">
        ⏳ Preparing captions...  
        <br />
        This will take a moment.
      </div>
    );
  }

  // -----------------------------------
  // ---- PLAYER + CAPTIONS RENDER -----
  // -----------------------------------
  return (
    <div className="w-full mt-8 flex flex-col items-center">
      {isYouTube ? (
        <div className="relative w-full max-w-[720px] aspect-video bg-black rounded-lg overflow-hidden">
          <YouTube
            videoId={videoId}
            opts={{
              width: "100%",
              height: "100%",
              playerVars: { controls: 1, autoplay: 1 },
            }}
            onReady={onYouTubeReady}
            className="absolute inset-0 w-full h-full"
          />
        </div>
      ) : blobUrl ? (
        <div className="relative w-full max-w-[720px] aspect-video bg-[#101723] rounded-lg overflow-hidden">
          <video
            ref={mediaRef}
            src={blobUrl}
            controls
            autoPlay
            className="absolute inset-0 w-full h-full object-contain rounded-lg"
          />
        </div>
      ) : (
        <audio
          ref={mediaRef}
          src={`http://localhost:8000/${audioPath}`}
          controls
          autoPlay
          className="w-full max-w-[720px]"
        />
      )}

      {/* CAPTIONS */}
      <div className="mt-4 bg-[#223149] text-white rounded-lg px-6 py-3 text-lg min-h-[56px] w-full max-w-[720px] text-center">
        {currentCaption || "Listening... captions will appear here."}
      </div>
    </div>
  );
}
