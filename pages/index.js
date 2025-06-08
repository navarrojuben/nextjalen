import Head from 'next/head';
import Portfolio from './portfolio';

export default function Home() {
  return (
    <>
      <Head>
        <title>NextJalen – Personal Portfolio</title>
        <meta name="description" content="Welcome to my portfolio site built with Next.js and Vercel." />
        <meta name="keywords" content="Next.js, Jalen, portfolio, Vercel, web development" />
        <meta name="author" content="Jalen Navarro" />
        <meta property="og:title" content="NextJalen Portfolio" />
        <meta property="og:description" content="A sleek and fast portfolio site by Jalen Navarro." />
        <meta property="og:url" content="https://nextjalen.vercel.app" />
        <meta property="og:type" content="website" />
      </Head>

      <main>
        <Portfolio />
      </main>
    </>
  );
}

