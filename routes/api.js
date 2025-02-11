const { Router } = require("express");
const {handleRoot, handleCodeChefData, handleCodeforcesData, handleLeetcodeData, handleGFGData} = require("../controller/controller.js");

const router = Router();

// get request router ...
router.get("/", handleRoot);
router.get("/codechef/:username", handleCodeChefData);
router.get("/codeforces/:username", handleCodeforcesData);
router.get("/leetcode/:username", handleLeetcodeData);
router.get("/gfg/:username", handleGFGData);

//login and signup router ...


module.exports = router;    