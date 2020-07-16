import mongoose from 'mongoose'
require('dotenv').config();
const nJwt = require('njwt');
import User from '@models/User';
import Post from '@models/Post';
import Category from '@models/Category'
import signingKey from './server'

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

//TODO: fix cb not a function errors
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

//API function
export async function createToken(user, cb) {
  let claims = {
    email:  user.email,
    scope: [ 'admin' ],
    iss: 'http://localhost:3000/'
  }
  const token = await nJwt.create(claims,signingKey).compact();
  return cb(token)
}

export async function verifyToken(token, cb) {
  nJwt.verify(token, signingKey, function(err, verifiedJwt){
    if(err){
      return cb(err); // Token has expired, has been tampered with, etc
    } else{
      return cb(null, verifiedJwt); // Will contain the header and body
    }
  });
}

export async function saveArticle(title, extended, author, state, date){
  let result = await Post.exists({ title: title })
  if (result == false ){
    //console.log(`inside savePost! title: ${title}, content extended: ${extended}, authors: ${author[0].value}, state: ${state}, date published: ${publishedDate}`)
    let authors = [];
    if(author !== undefined){
      author.map(auth => authors.push(auth.value))
    }
    let article = new Post ({
      title: title,
      content: {
        extended: extended
      },
      author: authors,
      state: state,
      publishedDate: date
    })
    return article.save()
  } else {
    let authors = [];
    if(author !== undefined){
      author.map(auth => authors.push(auth.value))
    }
    //console.log(`inside savePost! title: ${title}, content extended: ${extended}, authors: ${JSON.stringify(author)}`)
    let updatedArticle = {
      title: title,
      content: {
        extended: extended
      },
      author: authors,
      state: state,
      publishedDate: date
    }
    return Post.findOneAndUpdate({title: title}, {$set: updatedArticle}, {new: true}).exec()
  }
}

export function initArticle(title){
  let post = new Post({
    title: title
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
  return Post.find({slug: slug}).populate('author').exec();
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