import { Perfil } from "@prisma/client";
import { Request } from "express";
export type TAuthLogin  = {
    id: number;
    email: string
}
export interface AuthRequest extends Request {
    perfil?: Perfil | null
}