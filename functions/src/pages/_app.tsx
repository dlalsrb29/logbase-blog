import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import '../styles/globals.css';
import '../styles/awwwards-main.css';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from '@/contexts/AuthContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.svg" />
      </Head>
      <Script src="/162.30ed95ee.js" strategy="beforeInteractive" />
      <Script src="/966.e2e3d2ba.js" strategy="beforeInteractive" />
      <div className="antialiased">
        <Header />
        <Component {...pageProps} />
        <Footer />
      </div>
    </AuthProvider>
  );
} 