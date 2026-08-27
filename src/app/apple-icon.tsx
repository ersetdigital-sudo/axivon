import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const runtime = "edge";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 130,
          background: "linear-gradient(135deg, #ff5c2b 0%, #ff7a3f 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: 900,
          borderRadius: 36,
          letterSpacing: "-0.02em",
        }}
      >
        A
      </div>
    ),
    { ...size }
  );
}
