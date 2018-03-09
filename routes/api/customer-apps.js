'use strict';

const express    = require('express');
const router     = express.Router();
const bcrypt = require('bcrypt');
const uuidv4 = require ('uuid/v4');
const axios = require("axios");

const UserApplication = require('../../models/user-application');

// create new application with key and secret
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
          res.status(201).json(newApplication);
        });
    })
    .catch(next);
});

// get list of applications
router.get ('/getList', (req, res, next) => {
  const user = req.session.currentUser;

  UserApplication.find({user: user._id})
    .then((identifiedApps) => {
      console.log(identifiedApps);
      res.status(200).json(identifiedApps);
    });
})

// get API log for dashboard
router.get('/mylog',(req,res,next) => {
  const user = req.session.currentUser;
  let apiLog = [];

  UserApplication.find({"user":user._id}).lean()
    .then((result) => {
       return result.reduce(
          (acc,element) => {

            const options = {
              withCredentials: true,
              headers: {
                authtoken:element.apiKey.token
              }
            };
            return axios.get (process.env.MS1_URL+'/api/check-log/',options) 
              .then((requests) => {
                if (requests.data.apiLog.length > 0) {
                  acc.push(...requests.data.apiLog);
                }
                return acc;
              });

      },[]);
    })
    .then((apilog) => {
      res.status(200).json(apilog);
    });

});

// verify key and secret
router.post('/verify',(req,res,next) => {
  const key = req.body.apiKey;
  const secret = req.body.apiSecret;

  UserApplication.findOne( {"apiKey.token":key,"apiSecret.token":secret})
    .then((application) => {
      if (application === null) {
        return res.status(403).json({error:"Access Denied (incorrect credentials)"});
      } else {
        res.status(200).json({"application":application});
      }
  });
});

module.exports = router;
