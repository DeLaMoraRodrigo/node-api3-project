const express = require('express');
const postRouter = require("./posts/postRouter");
const userRouter = require("./users/userRouter");
const cors = require("cors")

const server = express();

server.use(express.json());
server.use(cors());

server.get('/', logger, (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use("/api/posts", postRouter);
server.use("/api/users", userRouter);

//custom middleware

function logger(req, res, next) {
  console.log(req.url);
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url}`
  );
  next();
}

server.use(logger)

server.listen(8000, () => {
  console.log("Api is running")
})

module.exports = server;
