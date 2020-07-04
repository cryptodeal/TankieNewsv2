import { listContributors } from '../../../mongoose'

export function get(req, res) {
	listContributors(function(contributors){
		let content = JSON.stringify(contributors.map(contributor => ({ 
			email: contributor.email
		})));
		res.writeHead(200, {
			'Content-Type': 'application/json'
		});
		res.end(content);
	});
}