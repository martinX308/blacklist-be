'use strict';
const express    = require('express');
const router     = express.Router();
const authCheck = require ('../../middelware/authCheck');

const BlackistEntry = require('../../models/blacklist-entry');
const UserApplication = require('../../models/user-application');
const RequestLog = require('../../models/request-log');

// create an blacklist entry with key and secret
router.post('/add', authCheck,(req,res,next) => { 
  const auth = req.get("authorization");
  const ddNumber = req.body.ddNumber;
  const credentials = new Buffer(auth.split(" ").pop(), "base64").toString("ascii").split(":");
  
  UserApplication.findOne( {"apiKey.token":credentials[0],"apiSecret.token":credentials[1]}) // internal API call to validate key and secret
    .then((application) => {
        const newEntry = BlackistEntry ({
          application:application._id,
          ddNumber
        });

        newEntry.save()
        .then(() => {
          console.log(newEntry);
          res.status(201).send("Dataset was processed successfully");
        });
    })    
    .catch(next);
})

//check against the blacklist
router.post('/check', authCheck,(req,res,next) => {
  const auth = req.get("authorization");
  const ddNumber = req.body.ddNumber;
  const credentials = new Buffer(auth.split(" ").pop(), "base64").toString("ascii").split(":");
  let match = false;

  BlackistEntry.find({"ddNumber":ddNumber})
    .then((list) => {
      if(list.length > 0) {
        match = true;
        res.status(200).json({"match":match});
      } else {
        res.status(200).json({"match": match});
      }
  })
  .then( () => { // store response in RequestLog
    const newRequest = RequestLog({
      api:credentials[0],
      response:match
    });
    newRequest.save()
    .then(()=> 
    console.log (newRequest));
  });
})


module.exports = router;