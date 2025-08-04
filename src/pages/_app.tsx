import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <div className="antialiased">
        <Header />
        <Component {...pageProps} />
        <Footer />
      </div>
    </>
  );
} 