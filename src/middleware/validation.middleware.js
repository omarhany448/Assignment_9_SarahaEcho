import { BadException } from "../common/exceptions/error.exceptions.js"

export const validation = (schema) => {
    return (req, res, next) => {
        const validationResult = schema.safeParse(req.body)
        if (!validationResult.success) {
            throw BadException("Validation Error", validationResult.error.issues)
        }
        req.validate = validationResult.data
        next()
    }
}