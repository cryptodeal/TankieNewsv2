// posts from './_posts.js';
import { findArticle, findArticlePromise, listCategoriesPromise, listContributorsPromise } from '../../../../mongoose'

export async function get(req, res, next) {
	const { slug } = req.params;
  console.log(`fetching article...`);
  let contributors = await listContributorsPromise()
  let categories = await listCategoriesPromise()
  let article = await findArticlePromise(slug)
  await console.log([article, categories, contributors])
  if(article.length){
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    let content = {
      article: article,
      categories: categories,
      contributors: contributors
    }
    res.end(JSON.stringify(content))
  } else {
    console.log(`no article found!`)
    res.writeHead(404, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({
      message: `Not found`
    }));
  }
}