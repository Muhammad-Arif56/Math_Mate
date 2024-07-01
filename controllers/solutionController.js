const userModel = require('../models/userModel.js')
const fs = require('fs');
const Tesseract = require('tesseract.js');
const WolframAlpha = require('@wolfram-alpha/wolfram-alpha-api');
const Solution = require('../models/solutionModel.js');
require('dotenv').config();
const multer = require('multer'); // Ensure multer is also required
const appId = process.env.WOLFRAM_ALPHA_APP_ID
const waApi = new WolframAlpha(appId);
console.log("🚀 ~ waApi:", waApi)


// Set up multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 1000000 }, // adjust the file size limit as needed
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  }
});
console.log("*****************");

const solveQuestion = async (req, res) => {
try {
 // Check if user exists
 const user = await userModel.findById(req.user.id);
 if (!user) {
   return res.status(404).json({ error: "User not found" });
 }

  const imagePath = req.file.path;
  // Use Tesseract.js to extract text from image
  Tesseract.recognize(imagePath, 'eng')
    .then(({ data: { text } }) => {
      // Use Wolfram Alpha API to solve the problem
      waApi.getFull(text)
        .then((queryresult) => {
          // Create a new solution document
          const solution = new Solution({
            question: text,
            result: queryresult
          });
          console.log(solution);
          // Save the solution to MongoDB
          solution.save()
            .then(() => {
              res.json(queryresult);
            })
            .catch((err) => {
              res.status(500).send(err);
            });
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    })
    .catch((err) => {
      res.status(500).send(err);
    })
    .finally(() => {
      // Clean up the uploaded file
      fs.unlink(imagePath, (err) => {
        if (err) console.error(err);
      });
    });
}catch (error) {
  console.log(error);
  return res.status(500).json({ error: "Internal server error" });
  }
};
console.log("##################################");




// get all questions history
const getAllQuestions = async (req, res)=>{
try{
  // Check if user exists
 const user = await userModel.findById(req.user.id);
 if (!user) {
   return res.status(404).json({ error: "User not found" });
 }
 const all_questions = await Solution.find({ userId: req.user.id });
 console.log("🚀 All Questions:", all_questions)
 if(!all_questions){
   return res.status(404).json({error: "No Question found by this id"})
 }
 return res.status(200).json({message: "All Questions : ", all_questions})

}catch (err) {
 console.log(err);
 console.error("Error in geting questions", err);
 return res.status(500).json({ error: "Internal server error" });
}
}






module.exports = { solveQuestion,getAllQuestions, upload };