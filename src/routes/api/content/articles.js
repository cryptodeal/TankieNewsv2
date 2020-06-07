import { savePost } from '../../../mongoose'
export function get(req, res, next) {
    console.log(`Save test reached API endpoint: /api/content/articles`)
    next()
}
export async function post(req, res, next) {
    console.log(`POST request received! Title: ${req.body.title}, Content: ${req.body.extended}`)
    savePost(req.body.title, req.body.extended, function(err, postDoc){
        if(err){
          console.log(err)
          res.statusCode = 500
            res.end()
        }
        if(!postDoc){
            console.log('Post already exists')
            res.statusCode = 409
                res.end()
        } else{
            console.log(`Post stored to databased successfully: ${postDoc}`)
            res.statusCode = 201
            res.end()
        }
    })

}
