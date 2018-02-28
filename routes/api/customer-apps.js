'use strict';

const express    = require('express');
const router     = express.Router();
const bcrypt = require('bcrypt');
const uuidv4 = require ('uuid/v4');

const UserApplication = require('../../models/user-application');


router.post('/create', (req, res, next) => {
  let expDate = new Date();
  const applicationName = req.body.application;
  const user = req.body.user;
  const apiKey = {};
  const apiSecret = {};


  if (!applicationName) {
    return res.status(422).json({error: 'Please enter a valid application name'});
  }

  UserApplication.findOne({applicationName, user}, 'applicationName,user')
    .then((userExists) => {
      if (userExists) {
        return res.status(422).json({error: 'This application already exists in your account'});
      }

      const newApplication = UserApplication({
        applicationName,
        user,
        apiKey: {
          expires: expDate.setDate(expDate.getDate()+ 252),
          token: uuidv4()
        },
        apiSecret : {
          expires: expDate.setDate(expDate.getDate()+ 252),
          token: uuidv4()
        }
      });

      return newApplication.save()
        .then(() => {
          res.status(200).json(newApplication);
        });
    })
    .catch(next);
});

router.get ('/getList/:id', (req, res, next) => {
  const user = req.session.currentUser;

  UserApplication.find({user: user._id})
    .then((identifiedApps) => {
      console.log(identifiedApps);
      res.status(200).json(identifiedApps);
    });
})

module.exports = router;