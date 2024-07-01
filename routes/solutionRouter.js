const express = require('express');
const authorizationMiddleware = require('../middlewares/myAuth');
const router = express.Router();
const {solveQuestion, upload, getAllQuestions} = require('../controllers/solutionController');
console.log("&&&&&");

router.post('/solve_problem', authorizationMiddleware, upload.single('image'), solveQuestion);
router.get('/get_all', authorizationMiddleware, getAllQuestions)

module.exports = router;
