const { Router } = require("express");
const { handleRoot, handleCodeChefData, handleCodeforcesData, handleLeetcodeData, handleGFGData, handleUserData } = require("../controller/controller.js");
const { handleSignup ,handleSignin } = require("../controller/userController.js")
const router = Router();

// get request router ...
router.get("/", handleRoot);
router.get("/codechef/:username", handleCodeChefData);
router.get("/codeforces/:username", handleCodeforcesData);
router.get("/leetcode/:username", handleLeetcodeData);
router.get("/gfg/:username", handleGFGData);

// To fetch user information from client by user username ...
router.get("/user/:username", handleUserData);

// login and signup router ...
router.post("/signup", handleSignup);
router.post("/signin", handleSignin);

module.exports = router;    