import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-[#223149] py-5 text-center text-sm text-[#90a7cb]">
      © {new Date().getFullYear()} CaptionFlux — All rights reserved.
    </footer>
  );
}
