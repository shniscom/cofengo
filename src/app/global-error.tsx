"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="tr">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          background: "#faf5ee",
          color: "#3b2a20",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Bir şeyler ters gitti</h1>
        <p style={{ color: "#5a4232" }}>
          Sayfa yüklenirken beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.
        </p>
        <button
          onClick={() => reset()}
          style={{
            borderRadius: "9999px",
            background: "#3b2a20",
            color: "#faf5ee",
            padding: "0.6rem 1.5rem",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          Tekrar Dene
        </button>
      </body>
    </html>
  );
}
