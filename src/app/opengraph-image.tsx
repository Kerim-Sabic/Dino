import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 48,
          background:
            "radial-gradient(circle at top left, rgba(228,186,122,0.28), transparent 35%), linear-gradient(180deg, #0b090c 0%, #151117 100%)",
          color: "#f7f2ea",
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#e4ba7a",
          }}
        >
          Privatna rezervacija u Sarajevu
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 82, lineHeight: 0.95 }}>Dino Merlin Koševo</div>
          <div style={{ fontSize: 46, lineHeight: 1.1 }}>
            Parter Zona 2 · fizičke ulaznice · preuzimanje uživo u Sarajevu
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#d7c4ad" }}>
          <div>Bez online plaćanja</div>
          <div>Privatna rezervacija</div>
        </div>
      </div>
    ),
    size,
  );
}
