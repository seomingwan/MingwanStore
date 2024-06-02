const express = require('express');

const { verifyToken, apiLimiter, corsWhenDomainMatches } = require('../middlewares');

const { productRegister } = require('../controllers/masterController');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

try {
    fs.readdirSync('uploads');
} catch (err) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done){
            done(null, 'uploads');
        },
        filename(req, file, done){

            file.originalname = Buffer.from(file.originalname, "latin1").toString("utf8");

            const ext = path.extname(file.originalname);
            const basename = path.basename(file.originalname, ext);
            done(null, basename + Date.now() + ext);
        },
    }),
    limits: { fileSize: 20 * 1024 * 1024 },
})

const router = express.Router();

router.post('/manage/productImage', apiLimiter, upload.array('image'), (req, res) => {
  return res.json(req.files[0].filename);
}); 

router.post('/manage/productRegister', apiLimiter, verifyToken, productRegister); 

module.exports = router;