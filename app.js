const express = require('express');
const app = express();
require('./config/db')
const bodyParser = require('body-parser');
const userRouter = require('./routes/userRouter');
const userProfileRouter = require('./routes/profileRouter')
const solutionRouter = require('./routes/solutionRouter');

const path = require('path');
require('dotenv').config();



//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//importing routesa
app.use('/auth/user', userRouter)
app.use('/auth/user', userProfileRouter)

app.use('/solution', solutionRouter);



const port = process.env.PORT || 8989;
app.listen(port, ()=>{
    console.log('Server is listening on port: " ' + port);
});
