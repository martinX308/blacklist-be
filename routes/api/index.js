'use strict';

const express  = require('express');
const router  = express.Router();

const authentication  = require('./auth');
const userView  = require('./company-details');
const application = require ('./application');

router.use('/auth', authentication);
router.use('/company-details', userView);
router.use('/application', application);


module.exports = router;