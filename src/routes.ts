import { Router, Application } from 'express'

import LoginController from './controllers/LoginController.js';
import { getBaseURL } from './util.js';
import { authenticate } from './middlewares/auth.js';
import AlunoController from './controllers/AlunoController.js';
import AdminAlunoController from './controllers/AdminAlunoController.js';
import AdminCursoController from './controllers/AdminCursoController.js';

export default function (app: Application) {
    const AuthRouter = Router()
    const AdminRouter = Router()
    const AlunosRouter = Router()

    // Rotas de login
    AuthRouter.post('/login', LoginController.index)
   


    AuthRouter.post('/reset/password', [authenticate], LoginController.reset);

    //ROTAS DE ADMINISTRADOR
    AdminRouter.get('/alunos', [authenticate], AdminAlunoController.getAllAlunos);
    AdminRouter.get('/alunos/:id', [authenticate], AdminAlunoController.getOneAluno);
    AdminRouter.get('/alunos/:id/curso', [authenticate], AdminAlunoController.getCursoAluno);

    AdminRouter.post('/cursos', [authenticate], AdminCursoController.store)
    AdminRouter.get('/cursos', [authenticate], AdminCursoController.getAll)
    AdminRouter.put('/cursos/:id', [authenticate], AdminCursoController.update)
    AdminRouter.delete('/cursos/:id', [authenticate], AdminCursoController.delete)
    AdminRouter.get('/cursos/:id/turmas', [authenticate], AdminCursoController.getTurmasWith)
    // ROTAS DE ALUNOS
    AlunosRouter.post('/', AlunoController.store)
    AlunosRouter.get('/:id', AlunoController.getOne)
    AlunosRouter.put('/:id', AlunoController.update)
    
    //Rota Geral

    app.use(getBaseURL('/'), AuthRouter)
    app.use(getBaseURL('/admin'), AdminRouter)
    app.use(getBaseURL('/alunos'), AlunosRouter)
    
    
}