'use strict';

const express    = require('express');
const router     = express.Router();
const bcrypt = require('bcrypt');

const RegApplication = require('../../models/reg-application');


router.post('/create', (req, res, next) => {

  const applicationName = req.body.application;
  const user = req.body.user;


  if (!applicationName) {
    return res.status(422).json({error: 'Please enter a valid application name'});
  }

  RegApplication.findOne({applicationName, user}, 'applicationName,user')
    .then((userExists) => {
      if (userExists) {
        return res.status(422).json({error: 'This application already exists in your account'});
      }

      const newApplication = RegApplication({
        applicationName,
        user
      });

      return newApplication.save()
        .then(() => {
          res.json(newApplication);
        });
    })
    .catch(next);
});

module.exports = router;