const User = require("../model/user.js");

async function handleSignup(req, res) {
    try {
        const user = await User.create({
            fullName: req.body.fullName,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        })

        res.status(200).json("user added");
    } 
    catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {handleSignup};