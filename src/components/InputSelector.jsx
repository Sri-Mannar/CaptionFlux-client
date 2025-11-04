// src/components/InputSelector.jsx
import React, { useState } from "react";

export default function InputSelector({ onReady }) {
  const [mode, setMode] = useState("link");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleGenerate = async () => {
    setStatus("Processing...");

    try {
      if (mode === "file" && file) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("http://localhost:8000/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (data.success) {
          const blobUrl = URL.createObjectURL(file);
          onReady({ blobUrl, audioPath: data.audio_path });
          setStatus("Uploaded and ready to play.");
        } else {
          setStatus("Upload failed: " + data.error);
        }
      } else if (mode === "link" && url) {
        const res = await fetch(
          `http://localhost:8000/fetch?url=${encodeURIComponent(url)}`
        );
        const data = await res.json();

        if (data.success) {
          onReady({ blobUrl: null, audioPath: data.audio_path });
          setStatus("Fetched audio and ready to play.");
        } else {
          setStatus("Fetch failed: " + data.error);
        }
      } else {
        setStatus("Please provide valid input.");
      }
    } catch (error) {
      console.error(error);
      setStatus("An error occurred.");
    }
  };

  return (
    <div className="w-full mt-10 text-white">
      <h2 className="text-[22px] font-bold tracking-tight px-4 pb-3 pt-5">
        Choose Your Input Method
      </h2>

      <div className="relative px-4">
        <div className="flex gap-8 border-b border-[#314668] relative">
          <div
            className={`absolute bottom-0 h-[3px] bg-[#3c83f6] transition-all duration-300 ease-in-out ${
              mode === "link" ? "left-0 w-[150px]" : "left-[178px] w-[90px]"
            }`}
          ></div>

          <button
            onClick={() => setMode("link")}
            className={`pb-3 pt-4 font-bold text-sm transition-colors duration-300 ${
              mode === "link" ? "text-white" : "text-[#90a7cb]"
            }`}
          >
            Provide a link as input
          </button>
          <button
            onClick={() => setMode("file")}
            className={`pb-3 pt-4 font-bold text-sm transition-colors duration-300 ${
              mode === "file" ? "text-white" : "text-[#90a7cb]"
            }`}
          >
            Upload a file
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4 px-4 py-4">
        {mode === "link" ? (
          <input
            type="text"
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full sm:w-[480px] h-14 bg-[#223149] text-white rounded-lg p-4 placeholder-[#90a7cb]"
          />
        ) : (
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full sm:w-[480px] text-[#90a7cb] bg-[#223149] rounded-lg p-3 cursor-pointer"
          />
        )}
      </div>

      <div className="flex justify-center px-4 py-3">
        <button
          onClick={handleGenerate}
          className="h-12 px-5 bg-[#3c83f6] text-white text-base font-bold rounded-lg hover:brightness-110 transition"
        >
          Generate
        </button>
      </div>

      {status && (
        <p className="text-center text-[#90a7cb] text-sm mt-2">{status}</p>
      )}
    </div>
  );
}
