import { Router, Application } from 'express'
import AdminController from './controllers/AdminController.js'
import LoginController from './controllers/LoginController.js';
import { getBaseURL } from './util.js';
import { authenticate } from './middlewares/auth.js';

export default function (app: Application) {
    const LoginRouter = Router()
    const AdminRouter = Router()

    //Rotas de administrar  [ALUNO]
    AdminRouter.get('/alunos', [authenticate], AdminController.get);


    // Rotas de login
    LoginRouter.post('/', LoginController.index)


    //Rota Geral
    app.post(getBaseURL('/reset/password'), [authenticate], LoginController.reset);

    app.use(getBaseURL('/login'), LoginRouter)
    app.use(getBaseURL('/admin'), AdminRouter)
}