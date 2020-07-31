require('dotenv').config();
const AWS = require('aws-sdk');
const sharp = require('sharp');

export async function post(req, res){
  if (!req.files || Object.keys(req.files).length === 0) {
    return (res.statusCode=400,res.end('No files were uploaded.'));
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  const file = req.files.sampleFile;
  if(!file.mimetype.startsWith('image')) {
    return (res.statusCode=400,res.end('Images only!'));
  }

  sharp(file.data)
  //.resize(200)
  .toFormat('webp')
  .toBuffer()
  .then(data => { 
    const S3_Bucket = `dev-tankienews`

    AWS.config.update({
      accessKeyId: process.env.AWS_ID,
      secretAccessKey: process.env.AWS_SECRET
    })
    file.name = file.name.substring(0, file.name.lastIndexOf('.'));
    console.log(file.name)
    const s3 = new AWS.S3();

    let params = {
      Bucket: S3_Bucket,
      Key: `${file.name}.webp`,
      Body: data
    }

    s3.upload(params, function(err, data) {
      if (err) {
        console.log(err)
        return (res.statusCode=500,res.end(JSON.stringify(err)))
      }
      console.log(data)
      return (res.end(JSON.stringify(data)))
    })
  })
  .catch( err => { 
    console.log(err)
    return (res.statusCode=500,res.end(JSON.stringify(err)))
   });
  
  // Use the mv() method to place the file somewhere on your server
//  sampleFile.mv(`uploads/${sampleFile.name}`, function(err) {
//    if (err)
//      return (res.statusCode=500,res.end(JSON.stringify(err)))
//  });
  //editImage(saved)
}
function editImage(sampleFile){


}