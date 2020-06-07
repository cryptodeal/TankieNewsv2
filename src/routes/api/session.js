import { validateUser, createToken } from '../../mongoose'


export async function post(req, res, next){
//REMOVE CONSOLE.LOG EMAIL AND PASSWORD BEFORE DEPLOYING TO PRODUCTION
  console.log(req.body.email)
  console.log(req.body.password)
  validateUser(req.body.email, req.body.password, function(err, user){
    if (err){
      console.log(err)
      res.statusCode = 500
        res.end()
    } if (user) {
      createToken(user, function(token){
        const expireInSix = new Date()
        expireInSix.setHours(expireInSix.getHours() + 6)
        console.log('creating token...')
        res.statusCode = 201
        res.setHeader('Set-Cookie', `authToken=${token}; Expires=${expireInSix}; HttpOnly; Path=/`)
          res.end()
      })
    } else {
      res.statusCode = 401
        res.end()
    }
  })
    
}
//Logout by expiring auth cookie
export async function del(req, res, next){
  res.statusCode = 200
  res.setHeader('Set-Cookie', `authToken=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Path=/`)
    res.end()
}
