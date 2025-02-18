const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const User = require("../model/user.js");
const { response } = require("express");

function handleRoot(req, res) {
    res.status(200).json("6th Sem MiniPro...");
}

// Codechef data handle
async function handleCodeChefData(req, res) {
    const { username } = req.params;
    const targetUrl = `https://www.codechef.com/users/${username}`;
    const codechefAPI = `https://codechef-api.vercel.app/handle/${username}`;

    try {
        const response = await fetch(targetUrl);
        const CCProfile = await fetch(codechefAPI).then(response => response.json()).then(data => data);

        if (response.ok) {
            const d = await response.text();
            const data = { data: d };
            const dom = new JSDOM(data.data);
            const document = dom.window.document;
            const problemSolvedElement = document.querySelector('.rating-data-section.problems-solved').lastElementChild;
            const totalProb = problemSolvedElement.innerHTML.split(" ")[3];

            const newData = { problemSolve: parseInt(totalProb), };

            const codeChefUserData = { ...newData, ...CCProfile };
            res.status(200).json(codeChefUserData);
        }
        else {
            res.status(response.status).send("Error fetching data from CodeChef");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Internal Server Error");
    }
}

// Codeforce data handle
async function handleCodeforcesData(req, res) {
    try {
        const { username } = req.params;
        const getUserdataUrl = `https://codeforces.com/api/user.info?handles=${username}`;
        const userSubmissionHistoryUrl = `https://codeforces.com/api/user.status?handle=${username}&from=1`;
        const userRatingListUrl = `https://codeforces.com/api/user.rating?handle=${username}`;

        const userData = await fetch(getUserdataUrl).then(response=> response.json()).then(data=> data);
        const userSubHistory = await fetch(userSubmissionHistoryUrl).then(response=> response.json()).then(data=> data);
        const userRatingList = await fetch(userRatingListUrl).then(response => response.json()).then(data => data);
        
        const userProfiledata = {
            userInformation: userData.result,
            submissionHistory: userSubHistory.result,
            rating: userRatingList.result,
        };

        res.status(200).json(userProfiledata);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

// Leetcode data handle
async function handleLeetcodeData(req, res) {
    const { username } = req.params;
    res.status(200).json({"message": username});
}

//GFG data handle
async function handleGFGData(req, res) {
    const { username } = req.params;
    res.status(200).json({"message": username});
}

module.exports = { handleRoot, handleCodeChefData, handleCodeforcesData, handleLeetcodeData, handleGFGData };