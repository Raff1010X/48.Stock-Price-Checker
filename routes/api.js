'use strict';
//EDITED
const express = require('express');
const stockController = require('../controllers/stockController');

const router = express.Router({ mergeParams: true });

router
    .route('/stock-prices')
    .get(stockController.getData);

module.exports = router;
