export const resolvers = {
    Query: {
      links: (_parent, _args, ctx) => {
        return ctx.prisma.link.findMany()
    },
    bookmarks: (_parent, _args, ctx) => {

      console.log('runnig')
      return ctx.prisma.user.findMany({
        select: {
          bookmarks: true
        }
      })
    }
  } 

}
  