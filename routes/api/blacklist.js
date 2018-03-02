'use strict';
const express    = require('express');
const router     = express.Router();
const authCheck = require ('../../middelware/authCheck');

const BlackistEntry = require('../../models/blacklist-entry');
const UserApplication = require('../../models/user-application');
const RequestLog = require('../../models/request-log');

router.post('/add', authCheck,(req,res,next) => {
  const auth = req.get("authorization");
  const ddNumber = req.body.ddNumber;
  const credentials = new Buffer(auth.split(" ").pop(), "base64").toString("ascii").split(":");
  
  UserApplication.findOne( {"apiKey.token":credentials[0],"apiSecret.token":credentials[1]})
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
  .then( () => {
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