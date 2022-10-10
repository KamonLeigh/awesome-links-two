import { ApolloClient, InMemoryCache } from "@apollo/client";
import { relayStylePagination} from '@apollo/client/utilities';
import { production, development } from "./config";


 //const uri = process.env.URI

const apolloClient = new ApolloClient({
    uri: process.env.NODE_ENV === 'development' ? development : production,
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    links: relayStylePagination()
                }
            }
        }
    }),

});

export default apolloClient