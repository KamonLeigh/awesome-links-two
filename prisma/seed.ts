import prisma from "../lib/prisma";
import { links } from "../data/links";

async function main() {
    console.log(links)
    await prisma.user.create({
        data: {
            email: 'testemail@gmail.com',
            role: 'ADMIN'
        }
    })

    await prisma.link.createMany({
        data: links
    })
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async() => {
        await prisma.$disconnect()
    })