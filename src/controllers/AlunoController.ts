import { Request, Response } from "express";
import PerfilRepository from "../repositories/PerfilRepository.js";
import { compareBcryptHash, defaultResponse, getBaseFullURL, getBcryptHash, jwtSign, roles } from "../util.js";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../types.js";
import { create } from "domain";
const prisma: PrismaClient = new PrismaClient()

export default class {

    public static async store(req: Request, res: Response) {

        /**
         * @body 
         * #nome,
         * #email
         * #password
         * #codigo_processo
         * #curso_id
         * #turma_id
         * #ano
         * **/

        const { nome, email, password, codigo_processo, curso_id, turma_id, ano } = req.body


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
                nome: nome,
                email: email,
                password: getBcryptHash(password),
                
            },
        })
        const aluno = prisma.alunos.create({
            data: {
                turma_id: turma.id,
                perfil_id: perfil.id
            },
        })

        return res.status(200).json({ ...defaultResponse })
    }


    /*RESET PASSORD*/
    public static async reset(req: AuthRequest, res: Response) {

        const { old_password, new_password } = req.body

        if (!old_password)
            return res.status(401).json({ message: "Não Autorizado, password incorreto![0]" })

        if (!new_password)
            return res.status(401).json({ message: "Não Autorizado, password incorreto![1]" })

        if (!((new_password as string).length > 8))
            return res.status(401).json({ message: "Não Autorizado, password nuito curta![2]" })

        if (new_password === old_password)
            return res.status(401).json({ message: "Não Autorizado, escolhe uma password diferenre ![3]" })

        try {
            if (!compareBcryptHash(old_password, req.perfil?.password!))
                return res.status(401).json({ message: "Não Autorizado, password incorreto!" })

            await prisma.perfil.update({
                where: { id: req.perfil?.id },
                data: { password: getBcryptHash(new_password), status: req.perfil?.role == "ADMIN" ? 0 : 1 }
            })

            return res.status(200).json({ ...defaultResponse, message: "Login successfull" })

        } catch (e: any) {
            return res.status(500).json({ message: e.message })
        }
    }

}