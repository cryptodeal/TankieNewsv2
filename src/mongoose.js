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

//API functions for interacting with Post Model
export async function savePost(title, extended, cb) {
    let result = await Post.findOne({ title: title }).select("_id").lean();
    if (!result){
        console.log(`inside savePost! title: ${title}, content extended: ${extended}`)
        let post = new Post ({
            title: title,
            content: {
                extended: extended
            },
          })
        post.save(function(err, postDoc) {
            if (err) return cb(err);
            console.log(postDoc);
            return cb(null, postDoc);
        });
    } else {
        cb(null, null)
    }

}