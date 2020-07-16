import { listCategories } from '../../../mongoose'

export function get(req, res) {
	listCategories().then(categories => {
    res.writeHead(200, {
			'Content-Type': 'application/json'
		});
		res.end(JSON.stringify(categories));
  }).catch(console.error)
}
