export const ApplicationException = ({

    message = "error",
    options = {
        cause: { status:400 },
    }

} ={} )=> {

    throw new Error(message , options)   

}


export const ConflictException = (message = "Conflict" , issues = {})=> {
    return ApplicationException({
        message,
        options: {
            cause: { status: 409, ...issues }
        }
    })
}


export const NotfoundException = (message = "Notfound" , issues = {})=> {
    return ApplicationException({
        message,
        options: {
            cause: { status: 409, ...issues }
        }
    })
}


export const UnautharizedException = (message = "Unautharized" , issues = {})=> {
    return ApplicationException({
        message,
        options: {
            cause: { status: 401, ...issues }
        }
    })
}


export const ForbiddenException = (message = "Forbidden" , issues = {})=> {
    return ApplicationException({
        message,
        options: {
            cause: { status: 403, ...issues }
        }
    })
}