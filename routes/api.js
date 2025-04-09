const { Router } = require("express");
const { handleRoot } = require("../controller/controller.js");
const { handleSignup ,handleSignin } = require("../controller/userController.js");
const { handleLeaderBoard } = require("../controller/rankController.js");
const { updateUserCodingProfile, handleUserData, addCodingProfileData } = require("../controller/userProfileController.js");

const router = Router();

// get request router ...
router.get("/", handleRoot); //working

// To fetch user information from client by user username ...
router.get("/user/:username", handleUserData); // working

// to update prifile data
router.put("/user/profile", addCodingProfileData); // working

// to update codeing profiles data
router.put("/user/:username", updateUserCodingProfile); // working but totalproblem count is not working

// login and signup router ...
router.post("/signup", handleSignup); // working
router.post("/signin", handleSignin); // working

// Leaderboard router ...
router.get("/leaderboard", handleLeaderBoard); // working

module.exports = router;    