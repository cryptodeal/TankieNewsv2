import mongoose from 'mongoose'
require('dotenv').config();
import User from '@models/User';
import Post from '@models/Post';
import Category from '@models/Category'
import signingKey from './server'
import jwt from 'jsonwebtoken'

mongoose.connect(process.env.MONGOOSE_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});

//async function to check if email exists, then create user in mongodb.
export async function createUser(email, password, cb) {
  let result = await User.findOne({ email: email }).select("_id").lean();
  if (!result){
    console.log(`inside createUser function email: ${email} and password: ${password}`)
    let user = new User ({
      email: email,
      password: password
    })
    user.save(function(err, userDoc) {
      if (err) return cb(err);
      return cb(null, userDoc);
    });
  } else {
    cb(null, null)
  }
}

export async function validateUser(email, password, cb) {
  let user = await User.findOne({email: email})
  user.comparePassword(password, async function(err, isMatch){
    if(err) return cb(err)
    if(!isMatch){
      return cb(null)
    } else {
      let result = await User.findOne({ email: email })
      return cb(null, result);
    }
  })
}

export async function createToken(user, cb){
  let claims = {
    email:  user.email,
    //hard coding scope until admin panel allows scope to be set
    scope: [ 'admin' ],
    iss: 'http://localhost:3000/'
  }
  let token = await jwt.sign(claims, signingKey, { expiresIn: '1h' });
  return cb(token)
}

export function verifyToken(token, cb){
  jwt.verify(token, signingKey, function(err, decoded) {
    if(err) return cb(err)
    return cb(null, decoded)
  });
}

export function routerVerify(token){
  return jwt.verify(token, signingKey, (err, verifiedJwt) => {
    if(err){
      return false
    }else{
      return verifiedJwt
    }
  })
}

export async function saveArticle(body){
  let result = await Post.exists({ title: body.title })
  if (result == false ){
    //console.log(`inside savePost! title: ${title}, content extended: ${extended}, authors: ${author[0].value}, state: ${state}, date published: ${publishedDate}`)
    let authors = [];
    let categories = []
    if(body.author !== undefined){
      body.author.map(auth => authors.push(auth.value))
    }
    body.author = authors
    if(body.categories !== undefined){
      body.categories.map(cat => categories.push(cat.value))
    }
    body.categories = categories
    let article = new Post (body)
    return article.save()
  } else {
    let authors = [];
    let categories = [];
    if(body.author !== undefined){
      body.author.map(auth => authors.push(auth.value))
    }
    body.author = authors
    if(body.categories !== undefined){
      body.categories.map(cat => categories.push(cat.value))
    }
    body.categories = categories
    //console.log(`inside savePost! title: ${title}, content extended: ${extended}, authors: ${JSON.stringify(author)}`)
    let updatedArticle = body
    return Post.findOneAndUpdate({title: body.title}, {$set: updatedArticle}, {new: true}).exec()
  }
}

export function initArticle(title){
  let post = new Post({
    title: title,
    content: {
      extended: ''
    }
  })
  return post.save()
}

export function deleteArticle(title){
  return Post.findOneAndDelete({title: title})
}

export function listArticles(){
  return Post.find({}).exec()
}

export function listContributors(){
  return User.find().select('email').lean().exec();
}

export function findArticle(slug){
  return Post.find({slug: slug}).populate('author').populate('categories').exec();
}

export function listCategories(){
  return Category.find({}).exec()
}

export async function addCategory(name){
  let result = await Category.exists({ name: name })
  if (result == false ){
    //console.log(`inside savePost! title: ${title}, content extended: ${extended}, authors: ${author[0].value}, state: ${state}, date published: ${publishedDate}`)
    let category = new Category({
      name: name
    })
    return category.save()
  } else {
    return null
  }
}