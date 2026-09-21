import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000",
  ),
  title: "Casa 101 · Residencial San Ignacio",
  description:
    "Catálogo digital de alquiler — Casa 101 en Residencial San Ignacio. US$5,000/mes.",
  openGraph: {
    title: "Casa 101 · Residencial San Ignacio",
    description: "Disponible a partir del 1 de enero de 2027. Contactar por WhatsApp.",
    images: ["/photos/01-fachada.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
