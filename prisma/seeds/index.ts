import { PrismaClient } from "@prisma/client";
import { getBcryptHash } from "../../src/util.js";
const prisma: PrismaClient = new PrismaClient()




async function main() {
    await prisma.perfil.create({
        data: {
            nome: "3admin",
            email: "admiroalfredo1742@gmail.com",
            password: getBcryptHash("admin"),
            role: "ADMIN",
            admin: {
                create: { permissoes: "FULL", updatedAt: new Date() }
            }
        }
    })
    await prisma.cursos.createMany({
        data: [
            { descricao: "ENGENHARIA INFORMÁTICA" },
            { descricao: "ENGENHARIA DE TELECOMUNICAÇÕES" }
        ]
    })
    await prisma.turmas.createMany({
        data: [
            { descricao: "A", curso_id: 1, ano: 2 },
            { descricao: "A", curso_id: 1, ano: 1 },
            { descricao: "B", curso_id: 2, ano: 1 },
            { descricao: "A", curso_id: 1, ano: 3 },
        ]
    })
    

}


main()
    .then(() => prisma.$disconnect())
    .catch((e) => console.error(":( Algo  deu errado ao criar as seeds", e.message))
