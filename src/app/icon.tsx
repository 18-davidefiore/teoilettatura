import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B1220",
          borderRadius: 96
        }}
      >
        <div
          style={{
            width: 340,
            height: 340,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(226,232,240,0.14)",
            borderRadius: 120
          }}
        >
          <div
            style={{
              width: 220,
              height: 220,
              background: "#E2E8F0",
              borderRadius: 999,
              position: "relative",
              display: "flex"
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 70,
                left: 56,
                width: 22,
                height: 22,
                background: "#0B1220",
                borderRadius: 999
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 70,
                right: 56,
                width: 22,
                height: 22,
                background: "#0B1220",
                borderRadius: 999
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 64,
                left: "50%",
                transform: "translateX(-50%)",
                width: 88,
                height: 10,
                background: "#0B1220",
                borderRadius: 999
              }}
            />
          </div>
        </div>
      </div>
    ),
    size
  );
}
