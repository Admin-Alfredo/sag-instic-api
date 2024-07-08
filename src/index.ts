import 'dotenv/config'
import express, { Router, Request, Response, Application } from 'express'
import cors from 'cors'
import compression from 'compression'
import bodyParser from 'body-parser'
import routes from './routes.js'
const app: Application = express()


app.use(cors())
app.use(compression())
app.use(express.json())
app.use(bodyParser.json({ limit: 1024 * 1024 * 5 }))
app.use(express.urlencoded({ extended: false }))



routes(app)

app.listen(process.env.APP_PORT || 3000, () => {
    console.log('Servidor rodando! ', process.env.APP_PORT)
})