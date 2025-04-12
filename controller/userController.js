const {User, UserData} = require("../model/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();


//function to handle signup
async function handleSignup(req, res) {
    try {
        //for password hashing using bcrypt
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = await User.create({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        })

        const userData = await UserData.create({
            name: req.body.name,
            username: req.body.username,
        })

        let token = jwt.sign({email:user.email, username: user.username},process.env.jwtSecret,);

        return res.status(200).send(token);
    } 
    catch (error) {
        return res.status(500).send("Internal Server Error");
    }
}


 
//function to handle signin
async function handleSignin(req, res) {
    try {
        const user = await User.findOne({
            email: req.body.email
        })

        if(!user){
            return res.status(404).json("invalid email or password");
        }   
        
        //compare hashed password
        const passMatch = await bcrypt.compare(req.body.password, user.password);
        if(!passMatch){
            return res.status(404).json("invalid email or password");
        }

        //jwt for sessions
        let token = jwt.sign({email:user.email, username: user.username},process.env.jwtSecret,);
        
        //sending the token to server as cookie
        // res.cookie("token",token,{httpOnly: true,secure: false});
        
        return res.status(200).send(token);
    } 
    catch (error) {
        return res.status(500).send("Internal Server Error");
    }
}

module.exports = {handleSignup, handleSignin};