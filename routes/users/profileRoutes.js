const express = require('express');
const router = express.Router();
const { getDashboardImages, getUpload, uploadImg, publishImg, getDashboard } = require('../../controllers/dashboardController');
const multer = require("multer");
const { storage } = require("../../cloudinary");
const upload = multer({ storage });


router.get('/dashboard', getDashboard);

router.get('/dashboard/:id', getDashboardImages);

router.get('/upload', getUpload);

router.post('/upload', upload.single('img'), uploadImg);

router.get('/dashboard/:id/publish', publishImg);



module.exports = router;