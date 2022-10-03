// /graphql/types/User.ts
import { enumType, objectType, extendType, stringArg, list, nonNull } from 'nexus'
import { Link } from './Link'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.string('id')
    t.string('name')
    t.string('email')
    t.string('image')
    t.field('role', { type: Role })
    t.list.field('bookmarks', {
      type: Link,
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.user
          .findUnique({
            where: {
              id: _parent.id,
            },
          })
          .bookmarks()
      },
    })
  },
})

const Role = enumType({
  name: 'Role',
  members: ['USER', 'ADMIN'],
})


export const BookmarkQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('bookmarks',{
      type: list('Link'),
      async resolve(_parent, _args, ctx) {
        console.log('running xxx')
        console.log(ctx.user)
      
        const user = await ctx.prisma.user.findUnique({
          where: {
            email: ctx.user.email
          },
          include: {
            bookmarks: true
          }
        })

      console.log(user)

        if (!user) throw new Error('Invalid user');

        console.log(user?.bookmarks)

        return user.bookmarks
      }

    })
  }
})


export const BookmarkLink = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('bookmarkLink', {
      type: 'Link',
      args: { 
        id: stringArg() 
      },
      async resolve(_parent, args, ctx) {
        const link = await ctx.prisma.link.findUnique({
          where: {
            id: args.id
          }
        })

        await ctx.prisma.user.update(
          {
            where: {
              email: ctx.user.email
            },
            data: {
              bookmarks: {
                connect: {
                  id: link.id
                }
              }
            }
          }
        )
        return link
      }
    })
  },
})

export const UpgradeUserAdmin = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('UpgradeUserAdmin',{
      type: 'User',
      args: {
        email: nonNull(stringArg())
      },
      async resolve(_parent, args, ctx) {

        const user = await ctx.prisma.user.findUnique({
          where: {
            email : ctx.user.email
          },
          select : {
            role: true
          }
        })

        if (!user) throw new Error('Invalid user');

        if (user.role !== 'ADMIN') {
          throw new Error("You are unable to perform this action");
        }

        return await ctx.prisma.user.update({
          where: {
            email: args.email
          },
            data: {
              role: 'ADMIN'
            }
        })

      }
    })
  },
})