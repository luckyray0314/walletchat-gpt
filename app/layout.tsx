import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from 'next/headers'
import "./globals.css";
import ContextProvider from "@/context/Context";
import Web3ModalProvider from "@/context/Wagmi";
import { config } from '@/config/wagmi'
import { cookieToInitialState } from 'wagmi'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WalletChat AI",
  description: "Conversational Blockchain explorer and Token analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get('cookie'))
  return (
    <Web3ModalProvider initialState={initialState}>
      <ContextProvider>
        <html lang="en">
          <body className={inter.className}>{children}</body>
        </html>
      </ContextProvider>
    </Web3ModalProvider>
  );
}
