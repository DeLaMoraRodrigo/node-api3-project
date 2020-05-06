const express = require('express');
const Users = require("./userDb");
const Posts = require("../posts/postDb");

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  Users.insert(req.body)
       .then(user => {
         res.status(201).json(user)
       })
       .catch(error => {
          console.log( error )
          res.status(500).json({ message: "Error creating user" })
       })
});

router.post('/:id/posts', validatePost, validateUserId, (req, res) => {
  Posts.insert({...req.body, user_id: req.params.id})
       .then(post => {
         res.status(200).json(post)
       })
       .catch(error => {
         console.log( error )
         res.status(500).json({ message: "Error in adding post" })
       })
});

router.get('/', (req, res) => {
  Users.get()
       .then(users => {
         res.status(200).json(users)
       })
       .catch(error => {
         console.log( error )
         res.status(500).json({ message: "Error retrieving users" })
       })
});

router.get('/:id', validateUserId, (req, res) => {
  if(req.user){
    res.status(200).json(req.user)
  }else if(!req.user){
    res.status(404).json({ message: "User with specified id could not be found"})
  }else{
    console.log( error )
    res.status(500).json({ message: "Error retrieving user with specified id" })
  }
});

router.get('/:id/posts', (req, res) => {
  Users.getUserPosts(req.params.id)
       .then(posts => {
         if(posts.length > 0){
           res.status(200).json(posts)
         }else{
           res.status(404).json({ message: "Either specified user has no posts or does not exist"})
         }
       })
       .catch(error => {
          console.log( error )
          res.status(500).json({ message: "Error retrieving posts from user with specified id" })
       })
});

router.delete('/:id', validateUserId, (req, res) => {
  Users.getById(req.params.id)
       .then(user => {
         if(user){
           Users.remove(req.params.id)
                .then(item => {
                  if(item > 0){
                    res.status(200)
                  }else{
                    res.status(404).json({ message: "User with specified id not found" })
                  }
                })
                .catch(error => {
                  console.log( error )
                  res.status(500).json({ message: "Error deleting user with specified id" })
                })
            res.json(user)
         }else{
            res.status(404).json({ message: "User with specified id not found" })
         }
       })
       .catch(user => {
          console.log( error )
          res.status(500).json({ message: "Error deleting user with specified id" })
       })
});

router.put('/:id', validateUserId, (req, res) => {
  Users.update(req.params.id, req.body)
       .then(user => {
          res.status(200).json(req.body)
       })
       .catch(error => {
         console.log( error )
         res.status(500).json({ message: "There was an error updating the user with specified id"})
       })
});

//custom middleware

function validateUserId(req, res, next) {
  Users.getById(req.params.id)
       .then(user => {
         if(user){
           req.user = user;
           next();
         }else{
           res.status(404).json({ message: "User with specified id could not be found" })
         }
       })
       .catch(error => {
          console.log( error )
          res.status(500).json({ message: "Error retrieving user with specified id" })
       })
}

function validateUser(req, res, next) {
  console.log(req.body)
 
  if(req.body){
    if(req.body.name){
      next();
    }else{
      res.status(400).json({ message: "User needs a name" })
    }
  }else{
    console.log(req.body)
    res.status(400).json({ message: "User is missing data" })
  }
}

function validatePost(req, res, next) {
  
  if (req.body) {
    if (req.body.text) {
      next();
    } else {
      res.status(400).json({ message: "Missing required text field" });
    }
  } else {
    res.status(400).json({ message: "Missing post data" });
  }
}

module.exports = router;
