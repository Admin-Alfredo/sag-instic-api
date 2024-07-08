import { PrismaClient } from '@prisma/client'
import { getBcryptHash } from '../../src/util.js'
const prisma = new PrismaClient()
async function main() {

    console.log(process.env.SECRET_KEY!)
    

    await prisma.perfil.create({
        data: {
            nome: "Admiro Alfredo",
            email: "admiroalfredo1742@gmail.com",
            password: getBcryptHash("admin"),
            role: 'ADMIN'
        }
    })

}
main()
    .then(async () => {
        await prisma.$disconnect();
        console.log("Seeding completed!")
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })