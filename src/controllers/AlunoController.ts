import { Request, Response } from "express";
import PerfilRepository from "../repositories/PerfilRepository.js";
import { compareBcryptHash, defaultResponse, getBaseFullURL, getBcryptHash, jwtSign, roles } from "../util.js";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../types.js";
import { create } from "domain";
const prisma: PrismaClient = new PrismaClient()

export default class {

    public static async store(req: Request, res: Response) {
        const {
            nome,
            email,
            password,
            codigo_processo,
            curso_id,
            turma_id,
            ano
        } = req.body
        try {

            const turma = await prisma.turmas.findUnique({ where: { id: turma_id } })
            if (!turma)
                return res.status(412).json({ message: "Oops! turma não existe." })

            if (turma.curso_id == curso_id)
                return res.status(412).json({ message: "Oops! O curso não é valido." })

            if (turma.ano == ano)
                return res.status(412).json({ message: "Oops!O a ano não é valido." })

            const perfil = await prisma.perfil.create({
                data: {
                    role: "ALUNO",
                    nome, email,
                    password: getBcryptHash(password)
                },
            })
            const aluno = prisma.alunos.create({
                data: {
                    turma_id: turma.id,
                    perfil_id: perfil.id,
                    codigo_processo,
                    updatedAt: new Date(),
                },
            })

            return res.status(200).json({ ...defaultResponse, data: { aluno } })
        } catch (e: Error | any) {
            return res.status(412).json({ message: e.message })
        }

    }


    /*RESET PASSORD*/
    public static async update(req: AuthRequest, res: Response) {
        
    }

}