import { findArticle } from '../../../mongoose'

export async function get(req, res, next) {
    console.log(`fetching article...`);
    findArticle(function(article){
        if(!article){
            res.statusCode = 204
            res.end()
        } else {
            console.log(article)
            res.statusCode = 200
            res.end(JSON.stringify(article))
        }
    })

}