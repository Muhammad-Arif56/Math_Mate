const userModel = require('../models/userModel');
const fs = require('fs');
const Tesseract = require('tesseract.js');
const WolframAlpha = require('@wolfram-alpha/wolfram-alpha-api');
const Solution = require('../models/solutionModel');
const multer = require('multer');
require('dotenv').config();

const appId = process.env.WOLFRAM_ALPHA_APP_ID;
const waApi = WolframAlpha(appId);

// Set up multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 1000000 }, // Adjust the file size limit as needed
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  }
});

const solveQuestion = async (req, res) => {
  try {
    // Check if user exists
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const imagePath = req.file.path;

    console.log(`Processing image: ${imagePath}`);

    // Use Tesseract.js to extract text from image with configurations
    const result = await Tesseract.recognize(imagePath, 'eng', {
      logger: m => console.log(m), // Add Tesseract.js logging
      tessedit_char_whitelist: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+-*/=()%', // Whitelist common math symbols
      preserve_interword_spaces: 1 // Preserve spaces between words
    });

    const extractedText = result.data.text;
    console.log("Extracted Text:", extractedText);

    // Clean and format the extracted text
    const cleanedText = extractedText.replace(/\n/g, ' ').trim();
    console.log("Cleaned Text:", cleanedText);

    if (!cleanedText) {
      return res.status(400).json({ error: "Could not extract text from image." });
    }

    // Use Wolfram Alpha API to solve the problem
    const queryresult = await waApi.getFull(cleanedText);

    // Log the query result for debugging
    console.log("Query Result:", queryresult);

    // Create a new solution document
    const solution = new Solution({
      question: cleanedText,
      result: queryresult,
      userId: req.user.id
    });

    // Save the solution to MongoDB
    await solution.save();

    res.json(queryresult);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  } finally {
    // Clean up the uploaded file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error(err);
    });
  }
};




// get all questions history
const getAllQuestions = async (req, res)=>{
try{
  // Check if user exists
 const user = await userModel.findById(req.user.id);
 console.log("🚀 ~ getAllQuestions ~ user:", req.user.id)
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