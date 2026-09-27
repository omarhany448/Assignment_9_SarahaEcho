import express from 'express'
import {
    authenticationController,
    messageController,
    userController
} from './modules/index.js'
import { globalErrorHandling } from './middleware/index.js'
import { bootstrapDB } from './DB/connection.db.js'
import { PORT } from './config.js'


const app = express()

bootstrapDB(app, PORT)

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


// to get ENC_KEY
/*
import crypto from 'node:crypto'
console.log(crypto.randomBytes(16).toString("hex"));   //  ENC_KEY=90acb7730ed7ba7ae2fb71cc0f2fc0bd => put it in .env.development
*/ 

// for  an experience
/*
const cipher = await encryption("lol");
const plain = await decryption(cipher);
*/ 