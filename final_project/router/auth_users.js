const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username
    const reviews = books[req.params.isbn].reviews
    const totalReviews = Object.keys(reviews).length
    const reviewId = totalReviews +1
   // console.log(username, books[req.params.isbn].reviews, Object.keys(reviews).length)
    const newReview = {"username": username, "comment": req.query.comment}
    let book = books[req.params.isbn]
    const existReview = Object.values(book.reviews).find(x => x.username === username)
    // console.log(existReview)
    if(totalReviews == 0 || (totalReviews > 0 && !existReview)){
        book.reviews[reviewId] = newReview
    }else{
        existReview.comment = req.query.comment
    }
    //console.log(books[req.params.isbn])
    res.send("Review for ISBN " + (' ')+ (req.params.isbn) + " Has been added/modified!");
});

//delete book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username
    const reviews = books[req.params.isbn].reviews
    let existReview = Object.values(reviews).find(x => x.username === username)
    if(existReview){
        delete existReview
        res.send(`Book ISBN ${req.params.isbn} review with username ${username} deleted.`);
    }else{
        res.send(`Failed to delete review, Book ISBN ${req.params.isbn} review with username ${username} not found.`);
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
