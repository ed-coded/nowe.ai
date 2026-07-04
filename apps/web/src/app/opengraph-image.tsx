import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";
import { brand } from "@/lib/branding";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const iconBase64 = readFileSync(
    join(process.cwd(), "public", "logo-icon.jpeg")
  ).toString("base64");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0f",
          backgroundImage:
            "radial-gradient(circle at 50% 35%, rgba(124,106,247,0.25), transparent 60%)",
        }}
      >
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: 32,
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/jpeg;base64,${iconBase64}`}
            width={116}
            height={116}
            style={{ objectFit: "contain" }}
            alt=""
          />
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "#f2f2f7",
            marginBottom: 20,
          }}
        >
          {brand.name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#8888aa",
            maxWidth: 820,
            textAlign: "center",
          }}
        >
          {brand.metadata.ogDescription}
        </div>
      </div>
    ),
    { ...size }
  );
}
