import { UserProvider } from '@auth0/nextjs-auth0';
import '../styles/globals.css'
import Layout   from "../components/Layout";
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import apolloClient from "../lib/apollo";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ApolloProvider client={apolloClient}>
        <Layout>
          <Component {...pageProps} />
      </Layout>
      </ApolloProvider>
    </UserProvider>
  )
}

export default MyApp
