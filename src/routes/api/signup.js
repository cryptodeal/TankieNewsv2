import { createUser } from '../../mongoose'

export async function post(req, res, next){
//REMOVE CONSOLE.LOG EMAIL AND PASSWORD BEFORE DEPLOYING TO PRODUCTION
    console.log(req.body.email)
    console.log(req.body.password)
    createUser(req.body.email, req.body.password, function(err, userDoc){
        if(err){
          console.log(err)
          res.statusCode = 500
            res.end()
        }
        if(!userDoc){
            console.log('user already exists')
            res.statusCode = 409
                res.end()
        } else{
            createToken(user, function(token){
                const expireInSix = new Date()
                expireInSix.setHours(expireInSix.getHours() + 6)
                res.statusCode = 201
                res.setHeader('Set-Cookie', `authToken=${token}; Expires=${expireInSix}; HttpOnly; Path=/`)
                  res.end()
              })
        }
    })
    
}
