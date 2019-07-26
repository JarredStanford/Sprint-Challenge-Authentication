const axios = require('axios');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { authenticate, jwtKey } = require('../auth/authenticate');

const Users = require('./route-helpers.js')

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
  // implement user registration
  const user = {
    username: req.body.username,
    password: req.body.password
  }

  const hash = bcrypt.hashSync(user.password, 14)
  user.password = hash

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
