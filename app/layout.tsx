import type React from "react"
import type { Metadata } from "next"
import { Baloo_2, Nunito, Patrick_Hand } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { ReminderNotifier } from "@/components/reminder-notifier"
import "./globals.css"

const baloo = Baloo_2({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
})

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const patrickHand = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-handwriting",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://bibletimeforkids.com"),
  title: {
    default: "Bible Time for Kids - Bible Verses & Quiz for Children Ages 4-12",
    template: "%s | Bible Time for Kids",
  },
  description:
    "Help children memorize Bible verses with fun quizzes, activities, and daily devotionals. Perfect for kids ages 4-12. Free Bible study games, memory verse challenges, and interactive learning.",
  keywords: [
    "bible verses for kids to memorize",
    "bible quiz for kids",
    "kids bible study",
    "children's church activities",
    "bible memory verse games",
    "bible trivia for kids",
    "sunday school games",
    "scripture for kids",
    "bible quiz competition questions",
    "free bible activity booklet",
    "bible lesson plan for kids",
  ],
  authors: [{ name: "Bible Time for Kids" }],
  creator: "Bible Time for Kids",
  publisher: "Bible Time for Kids",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bibletimeforkids.com",
    title: "Bible Time for Kids - Interactive Bible Learning for Children",
    description:
      "Fun Bible verses, quizzes, and activities for kids ages 4-12. Help children learn scripture with interactive games and daily devotionals.",
    siteName: "Bible Time for Kids",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bible Time for Kids - Learn Bible Verses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bible Time for Kids - Bible Verses & Quiz for Children",
    description:
      "Interactive Bible learning with quizzes, memory verse games, and daily devotionals for kids ages 4-12.",
    images: ["/og-image.png"],
    creator: "@bibletimekids",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  alternates: {
    canonical: "https://bibletimeforkids.com",
    languages: {
      "en-US": "https://bibletimeforkids.com",
      "en-NG": "https://bibletimeforkids.com/ng",
      "en-PH": "https://bibletimeforkids.com/ph",
      "tl-PH": "https://bibletimeforkids.com/ph/tl",
    },
  },
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} ${baloo.variable} ${patrickHand.variable} font-sans antialiased`}>
        {children}
        <ReminderNotifier />
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
