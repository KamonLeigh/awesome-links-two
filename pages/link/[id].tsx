
import { useState  } from "react";
import toast, { Toaster } from "react-hot-toast";
import { gql, useQuery, useMutation } from "@apollo/client"
import prisma from "../../lib/prisma";
import { useRouter } from "next/router";
import Head from 'next/head';
import NoItems from "../../components/NoItems";


const BookmarkQuery = gql`
    mutation bookmarkLink($id: String!) {
        bookmarkLink(id: $id) {
            title
            url
            imageUrl
            category
            description
        }
    }

`;


const DeleteLinkQuery = gql`
    mutation deleteLink($id: String!) {
        deleteLink(id: $id) {
             id
        }
    }
`


const Link = ({ link }) => {
    const [isLoading, setIsLoading ] = useState(false);
    const [createBookmark] = useMutation(BookmarkQuery);
    const [deleteLink] = useMutation(DeleteLinkQuery);
    const [isLoadingTwo, setLoadingTwo] = useState(false);
    const router = useRouter()

    const bookmark = async () => {
        setIsLoading(true);
        toast.promise(createBookmark({ variables: { id: link.id}}), {
            loading: 'working on it',
            success: 'Saved successfully! 🎉',
            error: `Something went wrong 😥 Please try again`,
        })

        setIsLoading(false)
    }

    const linkMutation = async () => {
        setLoadingTwo(true);
        toast.promise(deleteLink({ variables: { id: link.id}}), {
            loading: 'working on it',
            success: 'Deleted successfully! 🎉',
            error: `Something went wrong 😥 Please try again`,
        })

        setLoadingTwo(false)
        router.push("/")
    }
    
    if(!link) return  <NoItems message="Link doesn't exist 😥" className="text-red-500"/>

    return (
        <div>
           
          
            <div className="prose container mx-auto px-8">
                <Toaster/>
              <Head>
                <title>{link.title ?link.title : 'No Link' }</title>
              </Head>
        
        <button
          onClick={() => bookmark()}
          className="my-4 capitalize bg-blue-500 text-white font-medium py-2 px-4 mr-2 rounded-md hover:bg-blue-600"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="w-6 h-6 animate-spin mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
              </svg>
              Saving...
            </span>
          ) : (
            <span>Bookmark</span>
          )}
        </button>
        <button
          onClick={() => linkMutation()}
          className="my-4 capitalize bg-red-500 text-white font-medium py-2 px-4 rounded-md hover:bg-red-600"
        >
          {isLoadingTwo ? (
            <span className="flex items-center justify-center">
              <svg
                className="w-6 h-6 animate-spin mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
              </svg>
              Deleting...
            </span>
          ) : (
            <span>Delete</span>
          )}
        </button>
                <h1 className="tracking-wide mb-2 mt-16 text-xl">{link.title}</h1>
                <img src={link.imageUrl} alt={`${link.title} web page picture`} className="shadow-lg rounded-lg mb-16"/>
                <p>{link.description}</p>
                <a className="text-blue-500" href={`${link.url}`}>
                    {link.url}
                </a>
            </div>
        </div>
    )

}

export default Link 

export const getServerSideProps = async ({ params}) => {
    const id = params.id;
    const link = await prisma.link.findUnique({
        where: {id},
        select: {
            id: true,
            title: true,
            description: true,
            url: true,
            imageUrl: true
        }
    })
    console.log( link)

    return {
        props: {
            link
        }
    }
}