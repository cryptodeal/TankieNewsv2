import fetch from 'node-fetch';
export async function post(req, res, next) {
    console.log(`getting tweet info`);
    const response = await fetch(`https://publish.twitter.com/oembed?url=${req.body.url}&omit_script=true`)
    let data = await response.json()
    res.statusCode = 200
    console.log(data)
    res.end(JSON.stringify({
        data
    }));
}