const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const User = require("../model/user.js");
const { response } = require("express");

function handleRoot(req, res) {
    res.status(200).json("6th Sem MiniPro...");
}

// Codechef data handle
async function handleCodeChefData(req, res) {
    try {
        const { username } = req.params;
        const targetUrl = `https://www.codechef.com/users/${username}`;
        const codechefAPI = `https://codechef-api.vercel.app/handle/${username}`;

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

        // Official API of Codeforces
        const getUserdataUrl = `https://codeforces.com/api/user.info?handles=${username}`;
        const userSubmissionHistoryUrl = `https://codeforces.com/api/user.status?handle=${username}&from=1`;
        const userRatingListUrl = `https://codeforces.com/api/user.rating?handle=${username}`;

        // Geting user data from official api of Codeforces
        const userData = await fetch(getUserdataUrl).then(response => response.json()).then(data => data);
        const userSubHistory = await fetch(userSubmissionHistoryUrl).then(response => response.json()).then(data => data);
        const userRatingList = await fetch(userRatingListUrl).then(response => response.json()).then(data => data);

        //create heatmap from submission history...................
        // to make submission time into date formate
        const formatDate = (timestamp) => {
            const date = new Date(timestamp * 1000);
            return date.toISOString().split('T')[0];
        };

        // Count submissions per date
        const dateCounts = {};
        userSubHistory.result.forEach(sub => {
            const date = formatDate(sub.creationTimeSeconds);
            dateCounts[date] = (dateCounts[date] || 0) + 1;
        });

        const uniqueDates = Object.keys(dateCounts).sort();
        const heatMapData = uniqueDates.map((date) => ({
            date: date,
            value: dateCounts[date]
        }));

        const userProfiledata = {
            userInfo: userData.result,
            heatMap: heatMapData,
            ratingData: userRatingList.result,
        };

        res.status(200).json(userProfiledata);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

// Leetcode data handle
async function handleLeetcodeData(req, res) {
    try {
        const { username } = req.params;
        const gfgURL = `https://www.geeksforgeeks.org/user/${username}`;

        const response = await fetch(gfgURL);

        if (response.ok) {
            const d = await response.text();
            const data = { data: d };
            const dom = new JSDOM(data.data);
            const document = dom.window.document;

            const nextDataScript = document.getElementById("__NEXT_DATA__");
            const nextData = JSON.parse(nextDataScript.textContent);

            res.status(200).send(nextData.props.pageProps);
        }
        else {
            res.status(response.status).send("Error fetching data from CodeChef");
        }

    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

//GFG data handle
async function handleGFGData(req, res) {
    try {
        const { username } = req.params;
        const gfgURL = `https://www.geeksforgeeks.org/user/${username}`;

        const response = await fetch(gfgURL);

        if (response.ok) {
            const d = await response.text();
            const data = { data: d };
            const dom = new JSDOM(data.data);
            const document = dom.window.document;

            const nextDataScript = document.getElementById("__NEXT_DATA__");
            const nextData = JSON.parse(nextDataScript.textContent);

            res.status(200).send(nextData.props.pageProps);
        }
        else {
            res.status(response.status).send("Error fetching data from CodeChef");
        }

    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

module.exports = { handleRoot, handleCodeChefData, handleCodeforcesData, handleLeetcodeData, handleGFGData };