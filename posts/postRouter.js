const express = require('express');
const Posts = require("./postDb");

const router = express.Router();

router.get('/', (req, res) => {
  Posts.get()
       .then(posts => {
         res.status(200).json(posts)
       })
       .catch(error => {
         console.log( error )
         res.status(500).json({ message: "Error retrieving posts" })
       })
});

router.get('/:id', validatePostId, (req, res) => {
  if(req.post){
    res.status(200).json(req.post)
  }
});

router.delete('/:id', (req, res) => {
  Posts.getById(req.params.id)
       .then(post => {
         if(post){
           Posts.remove(req.params.id)
                .then(item => {
                  if(item > 0){
                    res.status(200)
                  }else{
                    res.status(404).json({ message: "Post with specified id not found" })
                  }
                })
                .catch(error => {
                  console.log( error )
                  res.status(500).json({ message: "Error deleting post with specified id" })
                })
            res.json(post)
         }else{
            res.status(404).json({ message: "Post with specified id not found" })
         }
       })
       .catch(post => {
        console.log( error )
        res.status(500).json({ message: "Error deleting post with specified id" })
       })
});

router.put('/:id', (req, res) => {
  
});

// custom middleware

function validatePostId(req, res, next) {
  Posts.getById(req.params.id)
       .then(post => {
          if(post){
            req.post = post;
            next();
          }else{
            res.status(404).json({ message: "Post with specified id could not be found" })
          }
       })
       .catch(error => {
         console.log( error )
         res.status(500).json({ message: "Error retrieving post with specified id" })
       })
}

module.exports = router;
