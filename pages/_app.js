import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';

const App = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Next Auth starter</title>
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default App;
