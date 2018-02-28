'use strict';

const express    = require('express');
const router     = express.Router();
const bcrypt = require('bcrypt');

const User = require('../../models/user');


router.post('/signup', (req, res, next) => {
  if (req.session.currentUser) {
    return res.status(401).json({error: 'You are already logged in'});
  }

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(422).json({error: 'Please enter a valid username and password'});
  }

  User.findOne({username}, 'username')
    .then((userExists) => {
      if (userExists) {
        return res.status(422).json({error: 'This username already exists'});
      }

      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = User({
        username,
        password: hashPass
      });

      return newUser.save()
        .then(() => {
          req.session.currentUser = newUser;
          res.json(newUser);
        });
    })
    .catch(next);
});
