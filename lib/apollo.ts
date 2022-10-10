import { ApolloClient, InMemoryCache } from "@apollo/client";
import { relayStylePagination} from '@apollo/client/utilities'

const uri = `${process.env.AUTH0_BASE_URL}/api/graphql`
const apolloClient = new ApolloClient({
    uri,
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    links: relayStylePagination()
                }
            }
        }
    })
});

export default apolloClient