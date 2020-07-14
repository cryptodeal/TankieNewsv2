import { listCategories } from '../../../mongoose'

export function get(req, res) {
	listCategories(function(categories){
		let content = JSON.stringify(categories.map(category => ({ 
			key: category.key,
			name: category.name
		})));
		res.writeHead(200, {
			'Content-Type': 'application/json'
		});
		res.end(content);
	});
}
