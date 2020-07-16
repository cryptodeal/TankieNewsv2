import { listArticles, initArticle } from '../../../mongoose'

export function get(req, res) {
  listArticles().then(articles => {
    let content = JSON.stringify(articles.map(article => ({ 
			title: article.title,
			slug: article.slug
    })));
    res.writeHead(200, {
			'Content-Type': 'application/json'
		});
		res.end(content);
  }).catch(console.error)
}

export function post(req, res) {
	initArticle(req.body.title).then(article =>{
    let content = JSON.stringify({
      slug: article.slug,
      title: article.title
    })
		res.writeHead(200, {
			'Content-Type': 'application/json'
		});
		res.end(content);
  }).catch(console.error)
}