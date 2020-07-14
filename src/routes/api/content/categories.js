import { addCategory, verifyToken, listCategories } from '../../../mongoose'

export function get(req, res) {
	listCategories(function(categories){
		let content = JSON.stringify(categories.map(category => ({ 
			value: category._id,
			label: category.name
		})));
		res.writeHead(200, {
			'Content-Type': 'application/json'
		});
		res.end(content);
	});
}

export async function post(req, res, next) {
    verifyToken(req.cookies['authToken'], function(err, verifiedJwt){
        if(err){
            console.log(err)
            res.statusCode = 401
                res.end()
            }
        else {
            console.log(verifiedJwt)
            console.log(`POST request received! Category Name: ${req.body.name}`)
            addCategory(req.body.name, function(err, catDoc){
                if(err){
                  console.log(err)
                  res.statusCode = 500
                    res.end()
                }
                if(!catDoc){
                    console.log('Category already exists')
                    res.statusCode = 409
                        res.end(JSON.stringify({
                            message: `Category already exists`
                        }));
                } else{
                    console.log(`Category stored to databased successfully: ${catDoc}`)
                    res.statusCode = 201
                    res.end(JSON.stringify({
                        message: `Category saved successfully`
                    }));
                }
            })
        }
    })
}
