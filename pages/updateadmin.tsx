
import Head from "next/head";
import prisma from '../lib/prisma';
import toast, { Toaster  } from "react-hot-toast";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/dist/server/api-utils";
import { useMutation, gql } from "@apollo/client";
import { useForm } from "react-hook-form";
import Link from 'next/link'

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
    const { register, handleSubmit, reset, formState:{ errors} } = useForm()
    const [updateUser, { loading, error}] = useMutation(UpgradeUserAdmin, {
        onCompleted: () => reset()
    })

    const onSubmit = async data => {
        const { email } = data
        const variables = { email };

        try {
            toast.promise(updateUser({variables}),{
                loading: 'Updating user...',
                success: 'User successfully updated!🎉',
                error: `Something went wrong 😥 Please try again -  ${error}`,
            })
            
        } catch (error) {
            console.error(error)
        }
    }
    return (
       <div className="container mx-auto max-w-md py-12">
            <Toaster/>
            <Head>
                <title>Upgrate user!!!</title>
            </Head>
            <h1 className="text-3xl font-medium my-5">Update User</h1>
            <form className="grid grid-cols-1 gap-y-6 shadow-lg p-8 rounded-lg" onSubmit={handleSubmit(onSubmit)}>
                <label className="block">
                    <span className="text-gray-700">Email</span>
                    <input
                        {...register('email', { required: true})}
                        placeholder="email"
                        type="email"
                        name="email"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300"
                    />
                </label>

            <button
                disabled={loading}
                type="submit"
                className="my-4 capitalize bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600"
            >
            {loading ? (
                <span>
            <svg
                className="w-6 h-6 animate-spin mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
              </svg>
                    Updating...
                </span>
            ): (
                <span>Update User</span>
            )}
        </button>
            </form>
            
       </div>
    )
}

export default UpdateAdminUser;

export const getServerSideProps = async ({ req, res}) => {
    const session = getSession(req, res)

    if (!session) {
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