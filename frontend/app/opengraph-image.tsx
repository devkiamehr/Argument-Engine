import { ImageResponse } from "next/og";

export const alt = "Inferex — Syllogism Analyzer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#FAF7F0",
          color: "#29304A",
          display: "flex",
          fontFamily: "Arial, sans-serif",
          height: "100%",
          padding: 80,
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            background: "#29304A",
            borderRadius: 44,
            display: "flex",
            height: 220,
            justifyContent: "center",
            marginRight: 56,
            width: 220,
          }}
        >
          <div
            style={{
              display: "flex",
              height: 112,
              position: "relative",
              width: 136,
            }}
          >
            <div
              style={{
                background: "#FAF7F0",
                borderRadius: 999,
                height: 34,
                left: 8,
                position: "absolute",
                top: 0,
                width: 34,
              }}
            />
            <div
              style={{
                background: "#FAF7F0",
                borderRadius: 999,
                height: 34,
                position: "absolute",
                right: 8,
                top: 0,
                width: 34,
              }}
            />
            <div
              style={{
                background: "#FAF7F0",
                borderRadius: 999,
                bottom: 0,
                height: 34,
                left: 51,
                position: "absolute",
                width: 34,
              }}
            />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 104,
              fontWeight: 700,
              letterSpacing: 0,
              lineHeight: 1,
            }}
          >
            Inferex
          </div>
          <div
            style={{
              fontSize: 44,
              lineHeight: 1.25,
              marginTop: 22,
            }}
          >
            Syllogism Analyzer
          </div>
          <div
            style={{
              color: "#5D6475",
              fontSize: 32,
              lineHeight: 1.35,
              marginTop: 90,
            }}
          >
            Analyze categorical syllogisms in plain language.
          </div>
        </div>
      </div>
    ),
    size
  );
}
