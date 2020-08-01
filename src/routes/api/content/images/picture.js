require('dotenv').config();
const AWS = require('aws-sdk');
const sharp = require('sharp');

export async function post(req, res){
  let sizes = [400, 800, 1200]
  if (!req.files || Object.keys(req.files).length === 0) {
    return (res.statusCode=400,res.end('No files were uploaded.'));
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  const file = req.files.sampleFile;
  const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
  if(!file.mimetype.startsWith('image')) {
    return (res.statusCode=400,res.end('Images only!'));
  }

  const promises = []
  sizes.map(size => {
    promises.push(webpEditUpload(size, file, baseName))
    promises.push(jpegEditUpload(size, file, baseName))
  })

  return Promise.all(promises).then(data => {
    data.map(datum => console.log(datum.Location))
  })

  // Use the mv() method to place the file somewhere on your server
//  sampleFile.mv(`uploads/${sampleFile.name}`, function(err) {
//    if (err)
//      return (res.statusCode=500,res.end(JSON.stringify(err)))
//  });
  //editImage(saved)
}

function jpegEditUpload(size, image, baseName){
  let jpegOptions = {
    quality: 70,
    progressive: false,
    force: false
  }
  return sharp(image.data)
    .resize({width: size, withoutEnlargement: true})
    .jpeg(jpegOptions)
    .toBuffer()
    .then(data => { 
      const S3_Bucket = `dev-tankienews`

      AWS.config.update({
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET
      })
      const s3 = new AWS.S3();

      let params = {
        Bucket: S3_Bucket,
        Key: `${baseName}-${size}.jpeg`,
        Body: data
      }

      let s3Promise = s3.upload(params).promise()
      return s3Promise
    })
    .catch( err => { 
      console.log(err)
      return err
    });
}
function webpEditUpload(size, image, baseName){
  let webpOptions = {
    quality: 75,
    lossless: false,
    force: true
  }
  return sharp(image.data)
  .resize({width: size, withoutEnlargement: true})
  .webp(webpOptions)
  .toBuffer()
  .then(data => { 
    const S3_Bucket = `dev-tankienews`

    AWS.config.update({
      accessKeyId: process.env.AWS_ID,
      secretAccessKey: process.env.AWS_SECRET
    })
    const s3 = new AWS.S3();

    let params = {
      Bucket: S3_Bucket,
      Key: `${baseName}-${size}.webp`,
      Body: data
    }

    let s3Promise = s3.upload(params).promise()
    return s3Promise
  })
  .catch( err => { 
    console.log(err)
    return err;
   });
}