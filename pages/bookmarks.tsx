import { AwesomeLink} from '../components/AwesomeLink'
import { gql, useQuery } from '@apollo/client'
import NoItems from '../components/NoItems'
import Head from 'next/head'

const BookmarksQuery = gql`
    query {
         bookmarks {
        title
        url
        imageUrl
        category
        description
        }
    }
    
`
 
const Bookmarks = () => {
    const { data, error, loading } = useQuery(BookmarksQuery);

    if (error) return <p> Oops! Something has gone wrong { error }</p>

    return (
        <div className='mx-auto my-20 max-w-5xl px-10'>
            <Head>
                <title>My Bookmarks</title>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <h1 className='text-3xl font-medium my-5'>My Bookmarks</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
                    {data.bookmarks.length === 0 ? (
                        <NoItems message="You haven't bookmarked any links yet 👀"/>
                    ) : (
                        data.bookmarks.map((link) => (
                            <div key={link.id}>
                                <AwesomeLink 
                                    title={link.title}
                                    description={link.description}
                                    category={ link.category}
                                    imageUrl={link.imageUrl}
                                    url={link.url}
                                    id={link.id}
                                />
                            </div>
                        ))
                    )}
                </div>
            )}

        </div>
    )

}

export default Bookmarks