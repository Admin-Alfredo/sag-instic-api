import { Router, Application } from 'express'
import AdminController from './controllers/AdminController.js'
import LoginController from './controllers/LoginController.js';
import { getBaseURL } from './util.js';
import { authenticate } from './middlewares/auth.js';

export default function (app: Application) {
    const AuthRouter = Router()
    const AdminRouter = Router()
    const AlunosRouter = Router()

    // Rotas de login
    AuthRouter.post('/login', LoginController.index)
    AlunosRouter.post('/cadastrar')


    AuthRouter.post('/reset/password', [authenticate], LoginController.reset);

    //Rotas de administrar  [ALUNO]
    AdminRouter.get('/alunos', [authenticate], AdminController.get);


    //Rota Geral

    app.use(getBaseURL('/'), AuthRouter)
    app.use(getBaseURL('/admin'), AdminRouter)
    app.use(getBaseURL('/alunos'), AlunosRouter)
    
    
}