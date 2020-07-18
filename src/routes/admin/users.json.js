import { listUsers } from '../../mongoose'

export function get(req, res) {
	listUsers().then(users => {
    res.writeHead(200, {
			'Content-Type': 'application/json'
		});
		res.end(JSON.stringify(users));
  }).catch(console.error)
}