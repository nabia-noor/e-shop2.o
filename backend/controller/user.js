const express = require("express");
const path = require("path");
const { upload } = require("../multer");
const router = express.Router();
const User = require("../model/user")
const ErrorHandler = require("../utils/ErrorHandler");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const { error } = require("console");

router.post("/create-user", upload.single("file"), async (req,res,next) =>{
    const {name,email,password} = req.body;
    const userEmail = await User.findOne({email});
    
    if(userEmail){
        const filename = req.file.filename;
        const filePath = `uploads/${filename}`;
        fs.unlink(filePath, (err) => {
            if(err){
                console.log(err);
                res.status(500).json({message: "Error deleting file"})
            } else {
                res.json({message:  "file deleted successfully"})
            }
        })   
    return next(new ErrorHandler("User already exists", 400));
    }

    const filename = req.file.filename;
    const fileUrl = path.join(filename);
   const user = {
    name: name,
    email: email,
    password: password,
    avatar: fileUrl,
};
const activationToken = createActivationToken(user);
const activationUrl =`http://localhost:3000/activation/${activationToken}`;
try {
    await sendMail({
        email: user.email,
        subject:"Activate your account",
        message:`Hello${user.name}, please click on the link to Activate your account: ${activationUrl}`,
    })
    res.status(201).json({
        success: true,
        message: `please check your email:- ${user.email} to Activate your account!`
    })
} catch (error) {
    return next(new ErrorHandler(error.message, 500))
}

try{

} catch (error) {
    return next(new ErrorHandler(error.message, 400));
 }
});

// create activation token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

module.exports = router;