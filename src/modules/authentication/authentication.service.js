import { ProviderEnum } from "../../common/enum/user.enum.js"
import { BadException, ConflictException, NotfoundException } from "../../common/exceptions/error.exceptions.js"
import { createOne , findOne } from "../../common/repository/index.js"
import { hash , encryption , createLoginCredentials } from "../../common/security/index.js"
import { WEB_CLIENT_ID } from "../../config.js"
import { UserModel } from "../../DB/model/user.model.js"
import bcrypt from "bcrypt"
import {OAuth2Client} from 'google-auth-library'

const client = new OAuth2Client();


async function verifyGoogleAccount(idToken) {
  const ticket = await client.verifyIdToken({
      idToken,
      audience: WEB_CLIENT_ID,  
  });
  const payload = ticket.getPayload();
  if (!payload.email_verified) {
    throw BadException("email not verified")
  }
  return payload
}



export const loginWithGmail = async(account, issuer) => {

    return await createLoginCredentials({ user:account , issuer})
}



export const signupWithGmail = async({ idToken } , issuer) => {
    console.log({ idToken });

    const {name,email,picture} = await verifyGoogleAccount(idToken);
    console.log({name,email,picture});

    const existAccount = await findOne({
        model: UserModel,
        filter: { email }
    })
    
    if (existAccount) {
        if (existAccount.provider != ProviderEnum.GOOGLE) {
            throw ConflictException("Invalid account provider")
        }
        return { status:200 , data: await createLoginCredentials({ user: existAccount, issuer })}
    }

    //add user
    const user = await createOne({
        model: UserModel,
        data: {
            username: name,
            email,
            confirmEmail: new Date(),
            provider: ProviderEnum.GOOGLE,
            image: picture
        }
    })
        return { status:201 , data: await createLoginCredentials({ user, issuer })}
}


export const signup = async({username , email , password , phone}) => {
    const duplicatedAccount = await findOne({
        model: UserModel,
        filter: { email },
        options: { select: "email" }
    })
    if (duplicatedAccount) throw ConflictException("Email Exist")
    
    
    
    const account = await createOne({
        model: UserModel,
        data: { 
            username,
            email,
            password: await hash(password),
            phone:await encryption(phone)
        }
    })
    return account
}

export const login = async({ email, password } , issuer) => {

      const account = await findOne({
        model: UserModel,
        filter: { email , provider: ProviderEnum.SYSTEM},
        // options: { select: "-password" }
    })
    if (!account) {
        throw NotfoundException("Not Exist")
    }

    const match = await bcrypt.compare(password, account.password)

    if (!match) {
        throw NotfoundException("Not Exist")
    }

    return await createLoginCredentials({ user:account , issuer})
}