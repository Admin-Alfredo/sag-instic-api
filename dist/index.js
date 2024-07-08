var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import 'dotenv/config';
import express, { Router } from 'express';
import cors from 'cors';
import compression from 'compression';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';
const app = express();
app.disable('x-powered-by');
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(bodyParser.json({ limit: 1024 * 1024 * 5 }));
app.use(express.urlencoded({ extended: false }));
const AlunoRouter = Router();
const defaultPerfil = {
    id: true,
    nome: true,
    email: true,
    createdAt: true,
    updatedAt: true,
};
const prisma = new PrismaClient();
// Nao vai ter uma rota de usuario
app.post('/login', function (req, res) {
});
AlunoRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const perfis = yield prisma.perfil.findMany({ select: defaultPerfil });
    console.log(perfis);
    return res.json(perfis);
}));
AlunoRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const perfil = req.body;
    perfil.role = "ALUNO";
    try {
        yield prisma.perfil.create({ data: perfil });
        return res.json({ message: "Perfil de usuario criado com successo" });
    }
    catch (e) {
        return res.status(500).json({ message: " Erro ao criar usuario", desc: e.message });
    }
}));
app.use(`${process.env.BASE_URL}/alunos`, AlunoRouter);
app.get(`${process.env.BASE_URL}/`, (_, res) => {
    res.send('Você chamou a rota raiz!');
});
app.listen(process.env.APP_PORT || 3000, () => {
    console.log('Servidor rodando! ', process.env.APP_PORT);
});
//# sourceMappingURL=index.js.map