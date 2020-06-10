//import posts from './_posts.js';
import { listArticles } from '../../mongoose'

function getContents(cb){
	let posts = listArticles(function(posts){
		let content = JSON.stringify(posts.map(post => ({ 
			title: post.title,
			slug: post.slug
		})));
		return cb(content)
	});
}

export function get(req, res) {
	let content = getContents(function(content){
		res.writeHead(200, {
			'Content-Type': 'application/json'
		});
	
		res.end(content);
	});
}