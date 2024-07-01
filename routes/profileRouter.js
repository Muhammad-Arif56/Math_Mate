const express = require('express');
const authorizationMiddleware = require('../middlewares/myAuth');
const {updateProfile} = require('../controllers/profileController');
const router = express.Router()


// router.post('/upload/:userId', upload, uploadPicture);
router.put('/update_profile', authorizationMiddleware,  updateProfile)

module.exports = router