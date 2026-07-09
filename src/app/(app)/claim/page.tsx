import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import ClaimPage from "./ClaimPage";
import "./claim.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "700"],
  style: ["normal", "italic"],
  variable: "--font-claim-serif",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-claim-sans",
});

export const metadata: Metadata = {
  title: "Claim Your Free Listing",
  description:
    "A free listing in the Missoula Legends registry for the trades that keep this town running. No fees, no website required, no catch.",
  robots: { index: false, follow: true }, // Remove this line if you want /claim indexed
  alternates: { canonical: '/claim' },
};

export default function Page() {
  return (
    <div className={`${playfair.variable} ${inter.variable} claimPage`}>
      <ClaimPage />
    </div>
  );
}
