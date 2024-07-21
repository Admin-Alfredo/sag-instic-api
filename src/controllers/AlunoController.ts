import { Request, Response } from "express";
import PerfilRepository from "../repositories/PerfilRepository.js";
import { clearParamsOnBody, compareBcryptHash, defaultPerfil, defaultResponse, getBaseFullURL, getBcryptHash, jwtSign, roles } from "../util.js";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../types.js";
import { create } from "domain";
const prisma: PrismaClient = new PrismaClient()

export default class {

    public static async store(req: AuthRequest, res: Response) {
        const {
            nome,
            email,
            password,
            codigo_processo,
            curso_id,
            turma_id,
            ano
        } = req.body
        let perfil;
        let aluno;

        if (Object.keys(req.body).length != 7)
            return res.status(412).json({ message: "Oops! dados em falta." });

        try {

            const turma = await prisma.turmas.findUnique({ where: { id: turma_id } })

            if (!turma)
                return res.status(412).json({ message: "Oops! turma não existe." })

            if (turma.curso_id != curso_id)
                return res.status(412).json({ message: "Oops! O curso não é valido." })

            if (turma.ano != ano)
                return res.status(412).json({ message: "Oops!O a ano não é valido." })

            perfil = await prisma.perfil.create({
                data: {
                    role: "ALUNO",
                    nome, email,
                    password: getBcryptHash(password)
                },
            })

            aluno = await prisma.alunos.create({
                data: {
                    turma_id: turma.id,
                    perfil_id: perfil.id,
                    codigo_processo,
                    updatedAt: new Date(),
                },
            })
            return res.status(200).json({ ...defaultResponse, data: { aluno }, message: "criado com sucesso, Espera validação do administrador." })

        } catch (e: Error | any) {
            if (perfil)
                await prisma.perfil.delete({ where: { id: perfil.id } })
            if (aluno)
                await prisma.perfil.delete({ where: { id: aluno.id } })

            if (e.code && e.code == 'P2002')
                return res.status(409).json({ message: `Violação de unicidade no modelo ${e.meta.modelName}` })

            return res.status(412).json({ message: e.message })
        }

    }
    public static async getOne(req: AuthRequest, res: Response) {
        try {
            const aluno = await prisma.alunos.findUnique({
                where: { id: Number(req.params.id) },
                include: { turma: true, perfil: true },
            })

            if (!aluno)
                return res.status(500).json({ message: `Erro ao pegar o dados de alunos` })

            const curso = await prisma.cursos.findUnique({
                where: { id: Number(aluno.turma.curso_id) },
            })
            clearParamsOnBody(aluno, ['password', 'role', 'status'])
            
            let data = curso ? { ...aluno, turma: { ...aluno.turma, curso } } : aluno

            return res.status(200).json({ ...defaultResponse, data })

        } catch (e: Error | any) {
            return res.status(500).json({ message: e.message })
        }

    }


    /*RESET PASSORD*/
    public static async update(req: AuthRequest, res: Response) {
        try {
            if (Object.keys(req.body).length == 0)
                return res.status(500).json({ message: `Erro ao atualizar o dados de alunos` })

            const aluno = await prisma.alunos.findUnique({ where: { id: Number(req.params.id) }, include: { perfil: true } })

            if (!aluno)
                return res.status(500).json({ message: `Erro ao atualizar o dados de alunos` })

            const perfil = await prisma.perfil.update({
                where: { id: aluno.perfil_id },
                data: { ...clearParamsOnBody(req.body), updatedAt: new Date() }
            })

            const data = { ...aluno, perfil: { ...clearParamsOnBody(perfil) } }

            return res.status(200).json({ ...defaultResponse, data: { aluno: data } })

        } catch (e: Error | any) {
            return res.status(500).json({ message: e.message })
        }
    }

}