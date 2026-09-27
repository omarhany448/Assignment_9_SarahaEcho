import crypto from 'node:crypto'
import { ENC_KEY, IV_LENGTH } from '../../config.js'

export const encryption = async (plaintext) => {

    const iv = crypto.randomBytes(IV_LENGTH)
    const cipherIv = crypto.createCipheriv("aes-256-cbc", ENC_KEY, iv)
    let cipherText = cipherIv.update(plaintext, 'utf-8', 'hex')
    cipherText += cipherIv.final("hex")

    console.log({ iv, ivStr: iv.toString("hex"), cipherIv, cipherText: `${iv.toString("hex")}::${cipherText}` });
    return `${iv.toString("hex")}::${cipherText}`
    
}

export const decryption = async (cipherText) => {
    const [hexIV, encryptedData] = cipherText.split("::")
    const iv = Buffer.from(hexIV, 'hex')
    console.log({ hexIV , iv, encryptedData });
    const decipherIv = crypto.createDecipheriv("aes-256-cbc", ENC_KEY, iv)
    let plaintext = decipherIv.update(encryptedData, "hex" , "utf-8")
    plaintext += decipherIv.final("utf-8")
    return plaintext
}