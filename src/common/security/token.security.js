import jwt from 'jsonwebtoken'

import { findById, findOne } from '../repository/index.js'
import { UserModel } from '../../DB/model/user.model.js'
import { TokenTypeEnum } from '../enum/security.enum.js'
import {
    BadException,
    NotfoundException
} from '../exceptions/error.exceptions.js'
import {
    ACCESS_USER_TOKEN_SIGNATURE,
    REFRESH_USER_TOKEN_SIGNATURE,
    ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN,
    ACCESS_ADMIN_TOKEN_SIGNATURE,
    REFRESH_ADMIN_TOKEN_SIGNATURE
} from '../../config.js'
import { RoleEnum } from '../enum/user.enum.js'
import { compare } from 'bcrypt'

export const createToken = async({
    payload = {},
    options = {},
    secret = ACCESS_USER_TOKEN_SIGNATURE
} = {}) => {
    return jwt.sign(payload, secret, options)
} 


export const verifyToken = async({
    token = "",
    secret = ACCESS_USER_TOKEN_SIGNATURE
} = {}) => {
    return jwt.verify(token, secret)
    
}


const getTokenSignature = async({role=RoleEnum.USER}= {}) => {
    let signatures;

    switch (role) {
        case RoleEnum.ADMIN:
            signatures = { accessSignature: ACCESS_ADMIN_TOKEN_SIGNATURE, refreshSignature: REFRESH_ADMIN_TOKEN_SIGNATURE }
            break;    
        default:
            signatures = { accessSignature: ACCESS_USER_TOKEN_SIGNATURE, refreshSignature: REFRESH_USER_TOKEN_SIGNATURE }
            break;
    }

    return signatures
}

const getSignature = async({tokenType=TokenTypeEnum.ACCESS , role=RoleEnum.USER}= {}) => {
    const signatures = await getTokenSignature({role})
    return tokenType == TokenTypeEnum.ACCESS ? signatures.accessSignature : signatures.refreshSignature
}

export const decodeToken = async ({
    authorization = "",
    tokenType=TokenTypeEnum.ACCESS
} = {}) => {

    const decoded = jwt.decode(authorization);

    console.log("AUTHORIZATION:", authorization);
    console.log("DECODED:", decoded);
    console.log("AUDIENCE:", decoded?.aud);


    if (!decoded?.aud?.length) {
        throw BadException("missing token payload")
    }

    const payload = await verifyToken({
        token: authorization , 
        secret: await getSignature({ tokenType , role:decoded.aud[0]})
    })

    console.log("PAYLOAD AFTER VERIFY:", payload)

    if (!payload?.sub) {
        throw BadException("missing token payload")
    }

    const user = await findById({
        model: UserModel,
        id: payload.sub
    })


    console.log("USER FROM DB:", user)

    if (!user) {
        throw NotfoundException("Invalid user")
    }

    return {user , payload}
}


export const createLoginCredentials = async ({
    options = {},
    issuer,
    user,
}) => {

    const { accessSignature , refreshSignature } = await getTokenSignature({ role: user.role })

  const access_token = await createToken({
        payload:{sub:user._id},
        secret: accessSignature,
        options: {
            ...options,
            issuer,
            audience: [user.role],
            expiresIn: ACCESS_TOKEN_EXPIRES_IN 
        }
  })

    console.log("NEW ACCESS TOKEN:", access_token)
    console.log("NEW DECODED TOKEN:", jwt.decode(access_token))

  const refresh_token = await createToken({
    payload:{sub:user._id},
    secret: refreshSignature,
    options: {
      ...options,
      issuer,
        audience: [user.role],
      expiresIn: REFRESH_TOKEN_EXPIRES_IN
    },
  })

  return { access_token, refresh_token }
}

export const basicAuth = async ({ email, password }) => {

    const user = await findOne({
        model: UserModel,
        filter: {
            email,
        }
    })
    if (!user) return NotfoundException("not Exist")
    const match = await compare(password, user.password)

    if (!match) return NotfoundException("not Exist")
    return user

}