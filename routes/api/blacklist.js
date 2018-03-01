'use strict';
const express    = require('express');
const router     = express.Router();
const authCheck = require ('../../middelware/authCheck');

const BlackistEntry = require('../../models/blacklist-entry');
const UserApplication = require('../../models/user-application');

router.post('/add', authCheck,(req,res,next) => {
  const auth = req.get("authorization");
  const ddNumber = req.body.ddNumber;
  const credentials = new Buffer(auth.split(" ").pop(), "base64").toString("ascii").split(":");
  
  UserApplication.findOne( {"apiKey.token":credentials[0],"apiSecret.token":credentials[1]})
    .then((application) => {
      if (application === null) {
           return res.status(403).json({error:"Access Denied (incorrect credentials)"});
      } else {

      const newEntry = BlackistEntry ({
        application:application._id,
        ddNumber
      })

      newEntry.save()
      .then(() => {
        console.log(newEntry);
        res.status(200).send("Dataset was processed successfully");
      });

      }
    })
    .catch(next);


})



module.exports = router;