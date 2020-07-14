import { listArticles, initArticle } from '../../../mongoose'

export function get(req, res) {
	listArticles(function(articles){
		let content = JSON.stringify(articles.map(article => ({ 
			title: article.title,
			slug: article.slug
    })));
    console.log(content)
		res.writeHead(200, {
			'Content-Type': 'application/json'
		});
		res.end(content);
	});
}

export function post(req, res) {
	initArticle(req.body.title, function(err, article){
    let content = JSON.stringify({
      slug: article.slug,
      title: article.title
    })
		res.writeHead(200, {
			'Content-Type': 'application/json'
		});
		res.end(content);
	});
}