import { Request, Response } from "express";
import PerfilRepository from "../repositories/PerfilRepository.js";
import { compareBcryptHash, defaultBodyLogin, getBaseFullURL, getBaseURL, getBcryptHash, jwtSign } from "../util.js";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../types.js";
const prisma: PrismaClient = new PrismaClient()

export default class {

    public static async index(req: Request, res: Response) {
        const { email, password } = req.body
        if (!email)
            return res.status(401).json({ message: "Não Autorizado, email ou senha incorreta [0]" })
        if (!password)
            return res.status(401).json({ message: "Não Autorizado, email ou senha incorreta [1]" })

        const perfil = await PerfilRepository.getOne({ email })

        if (!perfil)
            return res.status(404).json({ message: "Não Autorizado, Perfil não encontrado!" })

        if (!compareBcryptHash(password, perfil.password!)) {
            return res.status(404).json({ message: "Não Autorizado, email ou senha incorreta [2]" })
        }
        const token = jwtSign(JSON.stringify({ email: perfil.email, id: perfil.id }))

        if (perfil.role === 'ADMIN' && perfil.active == 0)
            return res.status(300).json({ ...defaultBodyLogin, reset: true, redirect_link: getBaseFullURL('/reset/password'), data: { token } })

        return res.status(200).json({ ...defaultBodyLogin, data: { token } })
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
                data: { password: getBcryptHash(new_password), active: req.perfil?.role == "ADMIN" ? 0 : 1 }
            })

            return res.status(200).json({ ...defaultBodyLogin, message: "Login successfull" })

        } catch (e: any) {
            return res.status(500).json({ message: e.message })
        }
    }

}