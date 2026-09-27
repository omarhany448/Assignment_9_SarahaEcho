import { resolve } from 'node:path'
import { config } from 'dotenv'

export const NODE_ENV = process.env.NODE_ENV ?? 'development'
config({ path: resolve(`.env.${NODE_ENV}`) })

export const PORT = parseInt(process.env.PORT ?? "9000")

export const DB_URI = process.env.DB_URI

export const SALT = parseInt(process.env.SALT ?? "12")

export const IV_LENGTH = parseInt(process.env.IV_LENGTH ?? "16")

export const ENC_KEY = process.env.ENC_KEY

