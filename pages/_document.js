// pages/_document.js

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        {/* ✅ Google Site Verification */}
        <meta name="google-site-verification" content="b2_Lytyf4zB-Dglo2VWdtlWB-s2UazvMS4JYtbR0XpY" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
