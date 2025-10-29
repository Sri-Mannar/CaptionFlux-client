import React from "react";

export default function Hero() {
  return (
    <section
      className="flex flex-col gap-6 items-center justify-center text-center min-h-[480px] rounded-lg bg-cover bg-center bg-no-repeat p-6 sm:p-10"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.4)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuAYfQz_akFUmiFaQRDC-bTJFHZWwMqJP6UC2r61IlHMbmMS4E6Hm0oYm_yp7jUDlv7YQCx54WGLMt_Q9W1WpStfzkOgMK0Ky2oJTa6LRIb7lEG9bJY1Is4GI8zZe-MiCCmp1R2FfztuMPC2I4opzknqhee06a8GpWcQ7b17kSqNYoqdu1NUB6h8jNjWMy_LqHvC-7zJbACsaEMATkMGidvgOeXZ4xufNbF4QIHhQL7fT8iraqQxCn6BiLTQW2VQljc4P36tBIhZq_Y4')",
      }}
    >
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
          Real-time Captions. Real-time Clarity.
        </h1>
        <p className="text-sm sm:text-base font-normal max-w-2xl mx-auto text-slate-100">
          CaptionFlux is an AI-powered platform that generates live captions for your videos and streams, ensuring clarity and accessibility for all viewers.
        </p>
      </div>

      <button className="h-12 px-6 bg-[#3c83f6] text-white font-bold text-base rounded-lg hover:brightness-110 transition">
        Generate Captions
      </button>
    </section>
  );
}
