import { ImageResponse } from "next/og";

export const alt = "TokenHood ($HOOD) – The Meme of Robinhood Ecosystem";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 90px",
          background: "radial-gradient(circle at 75% 45%, rgba(0,212,123,.35), #070B09 60%)",
          color: "#F3F7F4",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 24, letterSpacing: 8, color: "#00D47B" }}>THE MEME OF ROBINHOOD ECOSYSTEM</div>
          <div style={{ fontSize: 104, fontWeight: 900, lineHeight: 0.95, marginTop: 24, display: "flex", flexDirection: "column" }}>
            <span>THE HOOD</span>
            <span>
              IS <span style={{ color: "#B5FF5C" }}>&nbsp;GROWING.</span>
            </span>
          </div>
          <div style={{ fontSize: 40, marginTop: 36, color: "#8B9B90" }}>$HOOD · tokenhood.online</div>
        </div>
        <svg width="360" height="430" viewBox="0 0 400 480">
          <path d="M18 480 C26 408 70 360 140 336 L260 336 C330 360 374 408 382 480 Z" fill="#0c120f" />
          <path d="M200 34 C122 34 80 104 80 188 C80 262 104 314 148 346 C170 360 230 360 252 346 C296 314 320 262 320 188 C320 104 278 34 200 34 Z" fill="#111a15" stroke="#00D47B" strokeWidth="3" />
          <path d="M200 98 C148 98 120 146 120 200 C120 256 150 298 200 312 C250 298 280 256 280 200 C280 146 252 98 200 98 Z" fill="#020403" />
          <path d="M150 208 C158 194 178 190 190 198 C182 210 164 214 150 208 Z" fill="#B5FF5C" />
          <path d="M250 208 C242 194 222 190 210 198 C218 210 236 214 250 208 Z" fill="#B5FF5C" />
        </svg>
      </div>
    ),
    size,
  );
}
