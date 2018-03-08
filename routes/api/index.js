'use strict';

const express  = require('express');
const router  = express.Router();

const authentication  = require('./auth');
const userView  = require('./company-details');
const application = require ('./customer-apps');
//const blacklist = require ('./blacklist');


router.use('/auth', authentication);
router.use('/company-details', userView);
router.use('/customer-apps', application);
//router.use('/blacklist-entry', blacklist);

module.exports = router;