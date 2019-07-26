const axios = require('axios');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { authenticate, jwtKey } = require('../auth/authenticate');

const Users = require('./route-helpers.js')

module.exports = server => {
  server.post('/api/register', uniqueNameCheck, register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
  // implement user registration
  const user = {
    username: req.body.username,
    password: req.body.password
  }

  if (user.password) {
    const hash = bcrypt.hashSync(user.password, 14)
    user.password = hash
  } else {
    return res.status(400).json({
      message: "A password is required to register."
    })
  }

  Users.addUser(user)
    .then(saved => {
      res.status(201).json(saved)
    })
    .catch(err => {
      res.status(500).json({
        message: "There was a registration error."
      })
    })
}

function login(req, res) {
  // implement user login
  const { username, password } = req.body

  if (username && password) {
    Users.getUserByName(username)
      .then(user => {

        if (user && bcrypt.compareSync(password, user.password)) {
          const token = generateToken(user)
          res.status(200).json({
            message: `Welcome, ${user.username},`, token
          })
        } else {
          res.status(401).json({
            message: "Your username or password are incorrect."
          })
        }
      })
      .catch(err => {
        res.status(500).json({
          message: "There was an error logging in."
        })
      })
  } else {
    res.status(400).json({
      message: "Username or password are missing."
    })
  }
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}

function generateToken(user) {
  const jwtPayload = {
    subject: user.id,
    username: user.username
  }

  const jwtOptions = {
    expiresIn: '7d'
  }

  return jwt.sign(jwtPayload, jwtKey, jwtOptions)
}

//middleware
async function uniqueNameCheck(req, res, next) {

  if (req.body.username && req.body.password) {

    const { username } = req.body

    try {
      const user = await Users.getUserByName(username)
      user !== undefined
        ? res.status(400).json({
          message: "A user with this name already exists."
        })
        : next()
    } catch {
      res.status(500).json({
        message: "There was an error."
      })
    }

  } else {
    res.status(400).json({
      message: "Please include a username and password to register."
    })
  }
}
