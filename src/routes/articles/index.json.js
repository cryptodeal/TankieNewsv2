//import posts from './_posts.js';
import { listArticles } from '../../mongoose'

export function get(req, res) {
	listArticles(function(posts){
		let content = JSON.stringify(posts.map(post => ({ 
			title: post.title,
			slug: post.slug
		})));
		res.writeHead(200, {
			'Content-Type': 'application/json'
		});
		res.end(content);
	});
}