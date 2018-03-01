'use strict';

function authCheck (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).json({ error: 'No credentials sent!' });
  }
  next();
};

module.exports = authCheck;
