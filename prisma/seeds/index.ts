import { PrismaClient } from "@prisma/client";
import { compareBcryptHash, defaultResponse, getBcryptHash } from "../../src/util.js";
const prisma: PrismaClient = new PrismaClient()




async function main() {
    await prisma.perfil.create({
        data: {
            nome: "3admin",
            email: "admiroalfredo1742@gmail.com",
            password: getBcryptHash("admin"),
            admin: {
                create: { permissoes: "FULL", updatedAt: new Date()}
            }
        }
    })
}


main()
    .then(() => prisma.$disconnect())
    .catch((e) => console.error(":( Algo  deu errado ao criar as seeds", e.message))
