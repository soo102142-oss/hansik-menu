import type { Metadata } from "next"
import Script from "next/script"
import "./globals.css"

export const metadata: Metadata = {
  title: "오늘한끼 - 한식뷔페 오늘의 메뉴",
  description: "여의도, 강남, 종로 한식뷔페 오늘 메뉴를 한눈에! 매일 업데이트되는 한식뷔페 점심 메뉴 큐레이션 서비스",
  keywords: "한식뷔페, 오늘 메뉴, 여의도 점심, 강남 점심, 종로 점심, 한식뷔페 메뉴, 직장인 점심",
  openGraph: {
    title: "오늘한끼 - 한식뷔페 오늘의 메뉴",
    description: "여의도, 강남, 종로 한식뷔페 오늘 메뉴를 한눈에!",
    url: "https://todaylunch.co.kr",
    siteName: "오늘한끼",
    type: "website",
  },
  verification: {
    google: "5fMyf5Fr4Vjlnin8_QSsfeEF3T9M231WEleGBaWaL0U",
    other: {
      "naver-site-verification": ["bf34949cfae87b56e915f5398c4c469724eaa075"],
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-95FE5Q9ZB8"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-95FE5Q9ZB8');
          `}
        </Script>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4326462287360425"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
