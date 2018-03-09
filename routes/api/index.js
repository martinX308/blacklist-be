'use strict';

const express  = require('express');
const router  = express.Router();

const authentication  = require('./auth');
const application = require ('./customer-apps');


router.use('/auth', authentication);
router.use('/customer-apps', application);


module.exports = router;