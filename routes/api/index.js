'use strict';

const express  = require('express');
const router  = express.Router();

const authentication  = require('./auth');
const userView  = require('./company-details')


router.use('/auth', authentication);
router.use('/company-details', userView);

module.exports = router;