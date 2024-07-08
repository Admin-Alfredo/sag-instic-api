    import { Perfil, Prisma, PrismaClient } from "@prisma/client";

    const prisma: PrismaClient = new PrismaClient()
export default class PerfilRepository {
    public static getAll(where: Object = {}) {
        return prisma.perfil.findMany()
    }
    public static getOne(where: Object = {} , select: Object | null = null){
        return prisma.perfil.findFirst({ where})
    }
}