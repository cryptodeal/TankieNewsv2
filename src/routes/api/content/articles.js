import { saveArticle, verifyToken, deleteArticle } from '../../../mongoose'

export function post(req, res){
  verifyToken(req.cookies['authToken'], function(err, verifiedJwt){
    if(err){
      console.log(err)
      res.statusCode = 401
      res.end(JSON.stringify(err))
      }
    else {
      console.log(verifiedJwt)
      console.log(`POST request received! Title: ${req.body.title}, Content: ${req.body.extended}, authors: ${req.body.authors}, state: ${req.body.state}, date published: ${req.body.publishedDate}`)
      saveArticle(req.body.title, req.body.extended, req.body.author, req.body.state, req.body.publishedDate).then(article => {
        if(!article){
          console.log('Post already exists')
          res.statusCode = 409
          res.end(JSON.stringify({
              message: `Post already exists`
          }));
        } else{
          console.log(`Post stored to databased successfully: ${article}`)
          res.statusCode = 201
          res.end(JSON.stringify({
              message: `Post saved successfully`
          }));
          }
      }).catch(err => {
        console.log(err)
        res.statusCode = 500
        res.end(JSON.stringify(err))
      })
    }
  })
}

export async function del(req, res) {
	verifyToken(req.cookies['authToken'], function(err, verifiedJwt){
    if(err){
      console.log(err)
      res.statusCode = 401
      res.end()
      }
    else {
      console.log(verifiedJwt)
      console.log(`DELETE request received! Title: ${req.body.title}`)
      deleteArticle(req.body.title).then(deleted => {
        if(!deleted){
          console.log('cannot find post to delete')
          res.statusCode = 409
          res.end(JSON.stringify({
              message: `no post to delete`
          }));
        } else {
          console.log(`Post deleted successfully: ${deleted}`)
          res.statusCode = 201
          res.end(JSON.stringify({
              message: `Post deleted successfully`
          }));
        }
      }).catch(console.error)
    }
  })
}