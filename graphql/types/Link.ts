import { objectType, extendType, intArg, stringArg, nonNull  } from "nexus";
import { type } from "os";
import { resolve } from "path";

import { User } from "./User";

export const Link = objectType({
    name: 'Link',
    definition(t) {
        t.string('id')
        t.string('title'),
        t.string('url')
        t.string('description')
        t.string('imageUrl')
        t.string('category')
        t.list.field('users', {
            type: User,
            async resolve(_parent, _args, ctx) {
                console.log(_parent)
                return await ctx.prisma.link
                    .findUnique({
                        where: {
                            id: _parent.id
                        }
                    }).users()
            }
        })
    },
})

export const Edge = objectType({
    name: 'Edge',
    definition(t) {
        t.string('cursor')
        t.field('node', {
            type: Link
        })
    }
})


export const PageInfo = objectType({
    name: 'PageInfo',
    definition(t) {
        t.string('endCursor')
        t.boolean('hasNextPage')
    },
})

export const Response = objectType({
    name: 'Response',
    definition(t) {
        t.field('pageInfo', { type: PageInfo })
        t.list.field('edges', {
            type: Edge
        })
    }
})


export const LinksByIDQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.field('link', {
            type: 'Link',
            args: { id: nonNull(stringArg())
            },
            async resolve(_, args, ctx) {
                console.log(process.env.MIGRATE_DATABASE_URL)
                const link = ctx.prisma.link.findUnique({
                    where: {
                        id: args.id
                    }
                })
            }
        })

    
    },
})

export const LinksQuery = extendType({
    type: 'Query',
    definition(t) {
        t.field('links', {
            type: 'Response',
            args: {
                first: intArg(),
                after: stringArg()
            },
            async resolve(_, args, ctx) {
                let queryResults = null
                console.log('running')

                if (args.after) {
                    // check id there is a cursor as the argument
                    queryResults = await ctx.prisma.link.findMany({
                        take: args.first, // the number of items to return from the database
                        skip: 1, // skip the cursor
                        cursor: {
                            id: args.after, // the 
                        }

                    })
                } else {
                    // if no cursor, this means that this is the first request
                    // and we will return the first items in the database
                    queryResults = await ctx.prisma.link.findMany({
                        take: args.first
                    })
                }
                // if the initial request returns links
                if (queryResults.length > 0) {
                    // get last element in previous result set
                    const lastLinkInResults = queryResults[queryResults.length - 1]
                     // cursor we'll return in subsequent requests
                     const myCursor = lastLinkInResults.id 

                     // query after the cursor to check if we have nextPage
                     const secondQueryResults = await ctx.prisma.link.findMany({
                        take: args.first,
                        cursor: {
                            id: myCursor
                        },
                        orderBy: {
                            id: 'asc'
                        }
                     })

                     // return response

                     const result = {
                        pageInfo: {
                            endCursor: myCursor,
                            hasNextPage: secondQueryResults.length >= args.first // if the number of items requested is greater than the response of the second query, we have another page
                        },
                        edges: queryResults.map(link => ({
                            cursor: link.id,
                            node: link
                        }))
                     }

                    return result
                    
                }

                return {
                    pageInfo: {
                        endCursor: null,
                        hasNextPage: false
                    },
                    edges: []
                }
            }
        })
    },
})

export const CreateLinkMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('createLink',{
            type: Link,
            args: {
                title: nonNull(stringArg()),
                url: nonNull(stringArg()),
                imageUrl: nonNull(stringArg()),
                category: nonNull(stringArg()),
                description: nonNull(stringArg())
            },

           async resolve(_parent, args, ctx) {
                if (!ctx.user) {
                    throw new Error("You need to be logged in to perform an action");
                     
                }

                const user = await ctx.prisma.user.findUnique({
                    where: {
                        email: ctx.user.email
                    }
                })

                if (user.role !== 'ADMIN') {
                    throw new Error("You do not have permission to perform action");
                    
                }

                const newLink = {
                    title: args.title,
                    url: args.url,
                    imageUrl: args.imageUrl,
                    category: args.category,
                    description: args.description
                }

                return await ctx.prisma.link.create({
                    data: newLink
                })
           }
        })
    },
})

const UpdateLink = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('UpdateLink', {
            type: Link,
            args: {
                id: nonNull(stringArg()),
                title: stringArg(),
                url: stringArg(),
                imageUrl: stringArg(),
                category: stringArg(),
                description:stringArg()
            },
            async resolve(_parent, args, ctx){

                if (!ctx.user) {
                    throw new Error("You need to be logged in to perform action");
                    
                }

                const user = await ctx.prisma.user.findUnique({
                    where: {
                        email: ctx.user.email
                    }
                })

                if (user.role !== 'ADMIN') {
                    throw new Error("You are unable to perform this action");
                    
                }

                return await ctx.prisma.link.update({
                    where: {
                        id: args.id
                    },
                    data: {
                        title: args.title,
                        url: args.url,
                        imageUrl: args.imageUrl,
                        category: args.category,
                        description: args.description
                    }
                })
            }
        })
    },
})

export const DeleteLink = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('deleteLink',{
            type: Link,
            args: {
                id: nonNull(stringArg())
            },
            async resolve(_parent, args, ctx) {

                console.log('xxxx')
                if (!ctx.user) {
                    throw new Error("You need to be logged in!!!");
                    
                }

                const user = await ctx.prisma.user.findUnique({
                    where: {
                        email: ctx.user.email
                    }
                })

                if (user.role !== 'ADMIN') {
                    throw new Error("You are unable to perform this action")
                }


                return ctx.prisma.link.delete({
                    where: {
                        id: args.id
                    }
                })
                
            }
        })
    },
})