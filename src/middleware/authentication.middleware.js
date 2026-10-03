// import { TokenExpiredError } from "jsonwebtoken"
import { ForbiddenException, UnauthorizedException } from "../common/exceptions/error.exceptions.js"
import { basicAuth, decodeToken } from "../common/security/token.security.js"
import { TokenTypeEnum } from "../common/enum/security.enum.js"

export const authentication = (tokenType=TokenTypeEnum.ACCESS)=>{
    return async (req, res, next) => {

    const { authorization } = req.headers

    if (!authorization) {
        throw UnauthorizedException("Unauthorized Account")
    }

    const [key , credential] = authorization.split(" ") || []

    console.log({ key , credential });

    switch (key) {
        case "Basic":
            const [email , password] = Buffer.from(credential , 'base64').toString().split(":");
            req.user = await basicAuth({ email , password })
            break;
        case "Bearer":
            console.log("BEARER CREDENTIAL:", credential);
            const { user , payload } = await decodeToken({ authorization: credential , tokenType })
            req.user = user
            req.payload = payload
            break;
        default:
            next(new Error("Invalid authentication Schema" , {cause:{ status : 400 }}))
            break;
    }

    next()
}
}



export const authorization = (accessRole) => {
    return async (req, res, next) => {

        // console.log("USER ROLE:", req.user.role)
        // console.log("REQUIRED ROLE:", accessRole)

        if (req.user.role < accessRole) {
            throw ForbiddenException("Forbidden Account")
        }

        next()
    }
}



// export const authorization = (accessRoles) => {
//     return async (req, res, next) => {

//         if (!accessRoles.includes(req.user.role)) {
//             throw ForbiddenException("Forbidden Account")
//         }

//         next()
//     }
// }