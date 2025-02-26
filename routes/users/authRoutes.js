const express = require('express');
const router = express.Router();
const passport = require('passport');

const { getLogin, getSignup, postSignup, postLogin, getLogout } = require('../../controllers/authController');

router.get('/login', getLogin);

router.post('/login', postLogin);

router.get('/signup', getSignup);

router.post('/signup', postSignup);


router.get('/logout', getLogout);



module.exports = router;