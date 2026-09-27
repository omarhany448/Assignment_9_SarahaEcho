import { ConflictException, NotfoundException } from "../../common/exceptions/error.exceptions.js"
import { createOne , findOne } from "../../common/repository/index.js"
import { compare , hash , encryption , decryption } from "../../common/security/index.js"
import { UserModel } from "../../DB/model/user.model.js"
import bcrypt from "bcrypt"

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

export const login = async({ email, password }) => {
      const account = await findOne({
        model: UserModel,
        filter: { email},
        // options: { select: "-password" }
    })
    if (!account) {
        throw NotfoundException("Not Exist")
    }

    const match = await bcrypt.compare(password,account.password)

    if (!match) {
        throw NotfoundException("Not Exist")
    }

    account.phone = await decryption(account.phone)

    return account
}