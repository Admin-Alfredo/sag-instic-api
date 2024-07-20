import { Request, Response,  NextFunction } from "express";
import { TokenExpiredError } from "jsonwebtoken";
import { defaultPerfil, jwtVerify } from "../util.js";
import { AuthRequest, TAuthLogin } from "../types.js";
import {  Prisma, PrismaClient } from "@prisma/client";

const prisma: PrismaClient = new PrismaClient()


export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    
    const formatedToken = req.header('Authorization')?.split(" ")
    if (!formatedToken)
        return res.status(401).json({ message: "Não Autorizado! [0]" })

    const [role, token] = formatedToken

    if (!role)
        return res.status(401).json({ message: "Não Autorizado! [1]" })

    if (role !== "Bearer")
        return res.status(401).json({ message: "Não Autorizado! [2]" })

    if (!token)
        return res.status(401).json({ message: "Não Autorizado! [3]" })


    try {
        const decodedToken = jwtVerify(token) as TAuthLogin

        if (!decodedToken)
            return res.status(401).json({ message: "Não Autorizado! [4]" })

        let perfil = await prisma.perfil.findFirst({ where: { id: decodedToken.id }, select: { ...defaultPerfil, password: true } })
       
        if(!perfil)
            return res.status(404).json({ message: "Não Autorizado! [5]" })

        //@ts-ignore
        req.perfil = perfil

        next()

    } catch (e: any) {
        return res.status(500).json({ message: e.message })
    }

}; 