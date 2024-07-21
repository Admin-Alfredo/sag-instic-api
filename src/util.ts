import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
export const roles = { ADMIN: 'ADMIN', PROFESSOR: 'PROF', ALUNO: 'ALUNO' }

export const getBaseURL = (str: string) => process.env.BASE_URL + str;
export const getBaseFullURL = (str: string) => process.env.BASE_URL_FULL + str;

export const getBcryptHash = (str: string): string => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(str, salt)
}
export const compareBcryptHash = (inputStr: string, hash: string): boolean =>
    bcrypt.compareSync(inputStr, hash);

export const jwtSign = (payload: Object | string): string => {
    return jwt.sign(payload, process.env.SECRET_KEY!, {})
}
export const jwtVerify = (token: string): string | jwt.JwtPayload => {
    return jwt.verify(token, process.env.SECRET_KEY!)
}
export const clearParamsOnBody = (body: any, arr: string[] = []) => {
    if (arr.length != 0) {
        for (let props of arr) {
            if (body[props])
                delete body[props]
        }
        return body
    }
    if (body.password)
        delete body.password
    if (body.role)
        delete body.role
    if (body.createdAt)
        delete body.createdAt
    if (body.updatedAt)
        delete body.updatedAt
    if (typeof body.status == "number")
        delete body.status

    return body;
}

export const defaultResponse = {
    reset: false,
    redirect_link: null,
    data: { token: null },
    message: null
}
export const defaultPerfil = {
    id: true,
    nome: true,
    email: true,
    createdAt: true,
    updatedAt: true,
}