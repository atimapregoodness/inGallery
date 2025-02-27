const express = require('express');
const router = express.Router();

const { getExplore, getImg } = require('../controllers/exploreController');


router.get('/', getExplore);

router.get('/image/:id', getImg);

module.exports = router;
