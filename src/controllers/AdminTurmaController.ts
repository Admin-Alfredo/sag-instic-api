import { Request, Response } from "express";
import { clearParamsOnBody, defaultResponse } from "../util.js";
import { PrismaClient } from "@prisma/client";
const prisma: PrismaClient = new PrismaClient()
export default class {
    public static async store(req: Request, res: Response) {
        const { ano, descricao, curso_id } = req.body
        try {

            if (!curso_id || typeof curso_id != 'number')
                return res.status(500).json({ ...defaultResponse, message: "Erro ao cadastrar turma. curso inválido" })

            const curso = await prisma.cursos.findUnique({ where: { id: Number(curso_id) } })
            if (!curso)
                return res.status(500).json({ ...defaultResponse, message: "Erro ao cadastrar turma. curso inválido" })

            if (!ano || typeof ano != 'number')
                return res.status(500).json({ ...defaultResponse, message: "Erro ao cadastrar turma, ano inválido" })

            if (!descricao || typeof descricao != 'string' || descricao.length != 1)
                return res.status(500).json({ ...defaultResponse, message: "Erro ao cadastrar turma, descrição inválido" })

            let existTurma = await prisma.turmas.findFirst({ where: { AND: { ano, descricao: descricao.toUpperCase(), curso_id: curso.id } } })

            if (existTurma)
                return res.status(500).json({ ...defaultResponse, message: "Erro ao cadastrar turma, turma já existi" })

            const turmas = await prisma.turmas.create({ data: { ano, descricao: descricao.toUpperCase(), curso_id: curso.id } })

            return res.status(200).json({ ...defaultResponse, data: { turmas } })

        } catch (error: Error | any) {
            return res.status(500).json({ ...defaultResponse, message: error.message })
        }
    }
    public static async getAll(req: Request, res: Response) {
        try {
            const cursos = await prisma.cursos.findMany({})
            return res.status(200).json({ ...defaultResponse, data: { cursos } })

        } catch (error: Error | any) {

            return res.status(500).json({ ...defaultResponse, message: error.message })
        }
    }
    public static async getTurmasWithCurso(req: Request, res: Response) {

        const { curso_id } = req.params
        console.log(curso_id)
        try {
            if (!curso_id)
                return res.status(500).json({ ...defaultResponse, message: "Oops! curso inválido" })

            const turmas = await prisma.turmas.findMany({
                where: { curso_id: Number(curso_id) },
                include: { curso: true }
            })

            return res.status(200).json({ ...defaultResponse, data: { turmas } })

        } catch (error: Error | any) {
            return res.status(500).json({ ...defaultResponse, message: error.message })
        }
    }
    public static async update(req: Request, res: Response) {
        try {
            const cursos = await prisma.cursos.update({
                where: { id: Number(req.params.id) },
                data: req.body,
            })

            return res.status(200).json({ ...defaultResponse, data: { cursos } })

        } catch (error: Error | any) {
            return res.status(500).json({ ...defaultResponse, message: error.message })
        }
    }
    public static async delete(req: Request, res: Response) {
        try {
            const cursos = await prisma.cursos.delete({
                where: { id: Number(req.params.id) },
            })

            return res.status(200).json({ ...defaultResponse, data: { cursos } })

        } catch (error: Error | any) {
            return res.status(500).json({ ...defaultResponse, message: error.message })
        }
    }
    public static async getTurmasWith(req: Request, res: Response) {
        try {
            const turmas = await prisma.turmas.findMany({
                where: { curso_id: Number(req.params.id,) },
                include: { curso: true }
            })

            return res.status(200).json({ ...defaultResponse, data: { turmas } })

        } catch (error: Error | any) {
            return res.status(500).json({ ...defaultResponse, message: error.message })
        }
    }



}       