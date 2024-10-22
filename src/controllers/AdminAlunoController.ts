import { Request, Response } from "express";
import { clearParamsOnBody, defaultResponse } from "../util.js";
import { PrismaClient } from "@prisma/client";
import emailServices from "../services/email.js";
const prisma: PrismaClient = new PrismaClient()
export default class {
    public static async getAllAlunos(req: Request, res: Response) {
        try {
            const alunos = await prisma.alunos.findMany({ include: { perfil: true, turma: true } })

            return res.status(200).json({ ...defaultResponse, data: { alunos } })

        } catch (error: Error | any) {
            return res.status(500).json({ ...defaultResponse, message: error.message })
        }
    }
    public static async getOneAluno(req: Request, res: Response) {
        try {
            const aluno = await prisma.alunos.findUnique({
                where: { id: Number(req.params.id) },
                include: { turma: true, perfil: true },
            })
            if (!aluno)
                return res.status(412).json({ message: `Erro ao pegar o dados de alunos` })

            const curso = await prisma.cursos.findUnique({
                where: { id: Number(aluno.turma.curso_id) },
            })
            let data = curso ? {
                ...aluno,
                perfil: clearParamsOnBody(aluno.perfil, ['password']),
                turma: { ...aluno.turma, curso }
            } : aluno


            return res.status(200).json({ ...defaultResponse, data })

        } catch (error: Error | any) {
            return res.status(500).json({ ...defaultResponse, message: error.message })
        }
    }
    public static async getCursoAluno(req: Request, res: Response) {
        try {
            const aluno = await prisma.alunos.findUnique({
                where: { id: Number(req.params.id) },
                include: { turma: true },
            })
            if (!aluno)
                return res.status(412).json({ message: `Erro ao pegar o dados de alunos` })

            const curso = await prisma.cursos.findUnique({
                where: { id: Number(aluno.turma.curso_id) },
            })

            return res.status(200).json({ ...defaultResponse, data: { curso } })

        } catch (error: Error | any) {
            return res.status(500).json({ ...defaultResponse, message: error.message })
        }
    }
    public static async validar(req: Request, res: Response) {
        try {
            const aluno = await prisma.alunos.findUnique({
                where: { id: Number(req.params.id) },
            })
            if (!aluno)
                return res.status(412).json({ message: `Erro ao pegar o dados de alunos` })

            const perfil = await prisma.perfil.update({
                where: { id: Number(aluno.perfil_id) },
                data: { status: 1 }
            })
            const transporter = await emailServices.createTransporter();
            emailServices.options.setTo('admiro.znt@gmail.com')

            transporter.sendMail(emailServices.options, function (error, info) {
                if (error) {
                    console.log('Error', error);
                } else {
                    console.log('Email enviado: ', info);
                }
            });
            return res.status(200).json({ ...defaultResponse, message: "Aluno validado com sucesso!" })

        } catch (error: Error | any) {
            return res.status(500).json({ ...defaultResponse, message: error.message })
        }
    }

}       