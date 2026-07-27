import type { Metadata } from "next";
import "./globals.css";
import { VisitTracker } from "./VisitTracker";

export const metadata: Metadata = {
  title: "장미지눈썹연구소 · 극사실눈썹 창시자",
  description:
    "극사실눈썹 창시자 장미지 원장. 선릉의 무게로, 사람의 얼굴을 다시 정의합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&family=Noto+Sans+KR:wght@300;400;500;700;800&family=Noto+Serif+SC:wght@300;400;600;700;900&family=Noto+Sans+SC:wght@300;400;500;700&family=Inter:wght@300;400;500;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400;1,700&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,700&family=Nanum+Pen+Script&family=Black+Han+Sans&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <VisitTracker />
        {children}
      </body>
    </html>
  );
}
