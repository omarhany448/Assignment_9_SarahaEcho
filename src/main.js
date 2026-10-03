import express from 'express'
import {
    authenticationController,
    messageController,
    userController
} from './modules/index.js'
import { globalErrorHandling } from './middleware/index.js'
import { bootstrapDB } from './DB/connection.db.js'
import { PORT } from './config.js'
import cors from 'cors'

const app = express()

bootstrapDB(app, PORT)

app.use(cors())

app.use(express.json())

app.all('/', (req, res) =>
    res.status(200).send({ messege: "Hello World!" })
)

app.use("/auth", authenticationController)
app.use("/message", messageController)
app.use("/user", userController)

app.all("{/*dummy}", (req, res) =>
    res.status(404).send({ messege: "Invalid application routing" })
)

app.use(globalErrorHandling)
