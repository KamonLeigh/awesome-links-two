import { AwesomeLink} from '../components/AwesomeLink'
import { gql, useQuery } from '@apollo/client'

const BookmarksQuery = gql`
    query {
        bookmarks {
            title
            id
            url
            imageUrl
            description
            category
        }
    }
`

const Bookmarks = () => {
    const { data, error, loading } = useQuery(BookmarksQuery);

    if (error) return <p> Oops! Something has gone wrong { error }</p>

    return (
        <div className='mx-auto my-20 max-w-5xl px-10'>
            <h1 className='text-3xl font-medium my-5'>My Bookmarks</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
                    {data.bookmarks.length === 0 ? (
                        <p>
                            You haven't bookmarked any links yet 👀
                        </p>
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