'use strict';
const UserApplication = require('../models/user-application');

function authCheck (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).json({ error: 'No credentials sent!' });
  } else {
  const auth = req.get("authorization");
  const credentials = new Buffer(auth.split(" ").pop(), "base64").toString("ascii").split(":");
  UserApplication.findOne( {"apiKey.token":credentials[0],"apiSecret.token":credentials[1]})
    .then((application) => {
        if (application === null) {
          return res.status(403).json({error:"Access Denied (incorrect credentials)"});
      }
    next();
  });
}}

module.exports = authCheck;
