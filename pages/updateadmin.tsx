
import Head from "next/head";
import prisma from '../lib/prisma';
import toast, { Toaster  } from "react-hot-toast";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/dist/server/api-utils";
import { useMutation, gql } from "@apollo/client";

const UpgradeUserAdmin = gql`
    mutation($email:String!) {
        UpgradeUserAdmin(email: $email) {
            id
            name
            email
        }

    }
`

function UpdateAdminUser():JSX.Element {
    const [updateUser, { loading, error}] = useMutation(UpgradeUserAdmin, {
        onCompleted: () => reset()
    })
    return (
       <div className="container mx-auto max-w-md py-12">
            <Toaster/>
            <Head>
                <title>Upgrate user!!!</title>
            </Head>

       </div>
    )
}

export default UpdateAdminUser;

export const getServerSideProps = async ({ req, res}) => {
    const session = getSession(req, res)

    if (session) {
        return {
            redirect: {
                permanent: false,
                destination: '/api/auth/login'
            },
            props:{}
        }
        
    }

    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email
        },
        select: {
            email: true,
            role: true
        }
    })

    if (user.role !== 'ADMIN') {
        return {
            redirect: {
                permanent: false,
                destionation: '/404'
            },
            props: {}
        }  
    }

    return {
        props:{}
    }
}