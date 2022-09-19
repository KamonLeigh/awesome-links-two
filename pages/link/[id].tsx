import { Toaster } from "react-hot-toast"
import prisma from "../../lib/prisma"
const Link = ({ link }) => {

    return (
        <div>
            <div className="prose container mx-auto px-8">
                <Toaster/>

                <h1>{link.title}</h1>
                <img src={link.imageUrl} className="shadow-lg rounded-lg"/>
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
            title: true,
            description: true,
            url: true,
            imageUrl: true
        }
    })
    console.log(typeof link)

    return {
        props: {
            link
        }
    }
}