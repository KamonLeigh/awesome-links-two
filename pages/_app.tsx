import { UserProvider } from '@auth0/nextjs-auth0';
import '../styles/globals.css'
import '../styles/transition.css'
import Layout   from "../components/Layout";
import type { AppProps } from 'next/app';
import Transition from "../components/Transition";
import { ApolloProvider } from '@apollo/client';
import apolloClient from "../lib/apollo";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Transition>
      <UserProvider>
        <ApolloProvider client={apolloClient}>
            <Layout>
              <Component {...pageProps} />
          </Layout>
        </ApolloProvider>
      </UserProvider>
      </Transition>
  )
}

export default MyApp
