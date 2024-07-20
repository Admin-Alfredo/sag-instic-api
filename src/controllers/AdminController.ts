import { Request, Response } from "express";
import { AuthRequest } from "../types.js";
import { compareBcryptHash, defaultResponse, getBcryptHash } from "../util.js";
import { PrismaClient } from "@prisma/client";
const prisma: PrismaClient = new PrismaClient()
export default class {
    public static get(req: Request, res: Response) {
        return res.status(200).json({ message: "Perfil" })
    }
}