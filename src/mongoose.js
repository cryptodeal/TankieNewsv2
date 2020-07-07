import mongoose from 'mongoose'
require('dotenv').config();
const nJwt = require('njwt');
import User from '@models/User';
import Post from '@models/Post';
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

//API functions for interacting with Post Model
export async function savePost(title, extended, author, state, cb) {
  let result = await Post.exists({ title: title })
  console.log(result)
  if (result == false ){
    console.log(`inside savePost! title: ${title}, content extended: ${extended}, authors: ${author[0].value}`)
    let authors = [];
    author.map(auth => authors.push(auth.value))
    let post = new Post ({
      title: title,
      content: {
        extended: extended
      },
      author: authors,
      state: state
    })
    post.save(function(err, postDoc) {
      if (err) return cb(err);
      console.log(postDoc);
      return cb(null, postDoc);
    });
  } else {
    let authors = [];
    author.map(auth => authors.push(auth.value))
    //console.log(`inside savePost! title: ${title}, content extended: ${extended}, authors: ${JSON.stringify(author)}`)
    let updatedPost = {
      title: title,
      content: {
        extended: extended
      },
      author: authors,
      state: state
    }
    Post.findOneAndUpdate({title: title}, {$set: updatedPost}, {new: true},function(err, userDoc){
      if (err) return cb(err);
      return cb(null, userDoc);
    });
  }
}

export async function deleteArticle(title, cb){
  Post.findOneAndDelete({title: title}, function(err, deleted){
    if(err) return cb(err);
    return cb(null, deleted)
  })
}

export async function listArticles(cb) {
  //add .populate('author')
  //add .select('title, slug, author')
  let articles = await Post.find({}).lean();
  return cb(articles)
}

export async function listContributors(cb) {
  let contributors = await User.find().select('email').lean();
  console.log(contributors)
  return cb(contributors)
}

export async function findArticle(slug, cb) {
  let article = await Post.find({slug: slug}).populate('author')
  console.log(article)
  return cb(article)
}