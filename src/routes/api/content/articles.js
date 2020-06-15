import { savePost, listArticles, verifyToken } from '../../../mongoose'

export async function post(req, res, next) {
    verifyToken(req.cookies['authToken'], function(err, verifiedJwt){
        if(err){
            console.log(err)
            res.statusCode = 401
                res.end()
            }
        else {
            console.log(verifiedJwt)
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
                        res.end(JSON.stringify({
                            message: `Post already exists`
                        }));
                } else{
                    console.log(`Post stored to databased successfully: ${postDoc}`)
                    res.statusCode = 201
                    res.end(JSON.stringify({
                        message: `Post saved successfully`
                    }));
                }
            })
        }
    })
}

export async function get(req, res, next) {
    console.log(`fetching articles...`);
    listArticles(function(articles){
        if(!articles){
            res.statusCode = 204
            res.end()
        } else {
            console.log(articles)
            res.statusCode = 200
            res.end(JSON.stringify(articles))
        }
    })

}
