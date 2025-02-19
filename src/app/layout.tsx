import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import StyledComponentsProvider from "@/components/StyledComponentsProvider";

export const metadata: Metadata = {
  title: "-",
  description: "_",
  // icons: {
  //   icon: '/favicon_logo.png',
  // },
};

const pretendard = localFont({
  src: "../../public/fonts/woff/PretendardVariable.woff",
  display: "swap",
  weight: "400...1000",
  variable: "--font-pretendard",
});

console.log(pretendard);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.variable}`}>
        <StyledComponentsProvider>{children}</StyledComponentsProvider>
      </body>
    </html>
  );
}
