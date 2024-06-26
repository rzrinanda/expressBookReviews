const express = require ('express');
let books = require ('./booksdb.js');
let isValid = require ('./auth_users.js').isValid;
let users = require ('./auth_users.js').users;
const public_users = express.Router ();

public_users.post ('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid (username)) {
      users.push ({username: username, password: password});
      return res
        .status (200)
        .json ({message: 'User successfully registered. Now you can login'});
    } else {
      return res.status (404).json ({message: 'User already exists!'});
    }
  }
  return res.status (404).json ({message: 'Unable to register user.'});
});

// Get the book list available in the shop
public_users.get ('/', async (req, res) => {
  try {
    const books = await getAllBooks ();
    res.send (JSON.stringify (books, null, 4));
  } catch (error) {
    res.status (500).json ({message: error.message});
  }
});
const getAllBooks = () => {
  return new Promise (resolve => {
    setTimeout (() => {
      resolve (books);
    }, 200);
  });
};

// Get book details based on ISBN
public_users.get ('/isbn/:isbn', function (req, res) {
  getByISBN (req.params.isbn)
    .then (result => {
      res.send (JSON.stringify (result, null, 4));
    })
    .catch (err => {
      res.status (500).json ({message: err.message});
    });
  // res.send (JSON.stringify (books[req.params.isbn], null, 4));
});

const getByISBN = isbn => {
  return new Promise (resolve => {
    setTimeout (() => {
      resolve (books[isbn]);
    }, 200);
  });
};

// Get book details based on author
public_users.get ('/author/:author', function (req, res) {
  res.send (
    JSON.stringify (
      Object.values (books).filter (
        x => x.author.toLowerCase () === req.params.author.toLowerCase ()
      ),
      null,
      4
    )
  );
});

// Get all books based on title
public_users.get ('/title/:title', function (req, res) {
  res.send (
    JSON.stringify (
      Object.values (books).filter (x =>
        x.title.toLowerCase ().includes (req.params.title.toLowerCase ())
      ),
      null,
      4
    )
  );
});

//  Get book review
public_users.get ('/review/:isbn', function (req, res) {
  res.send (JSON.stringify (books[req.params.isbn].reviews, null, 4));
});

module.exports.general = public_users;
