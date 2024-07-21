import { Request, Response } from "express";
import { clearParamsOnBody, defaultResponse } from "../util.js";
import { PrismaClient } from "@prisma/client";
const prisma: PrismaClient = new PrismaClient()
export default class {
    public static async store(req: Request, res: Response) {
        let cursos;
        try {
            console.log(req.body)
            if (Array.isArray(req.body))
                cursos = await prisma.cursos.createMany({ data: req.body })
            else
                cursos = await prisma.cursos.create({ data: req.body })
            return res.status(200).json({ ...defaultResponse, data: { cursos } })

        } catch (error: Error | any) {
            console.log(error)
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
                where: { curso_id: Number(req.params.id, ) },
                include:{ curso: true }
            })

            return res.status(200).json({ ...defaultResponse, data: { turmas } })

        } catch (error: Error | any) {
            return res.status(500).json({ ...defaultResponse, message: error.message })
        }
    }



}       