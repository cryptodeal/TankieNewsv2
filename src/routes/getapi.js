import signingKey from '../server'

export function get(res, req, next){
    console.log(`Printing Secure random from /getapi: ${signingKey}`)
    next()
}