const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

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

            const userProfileData = { ...newData, ...CCProfile };
            res.status(200).json(userProfileData);
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

        const userProfileData = {
            userInfo: userData.result,
            heatMap: heatMapData,
            ratingData: userRatingList.result,
        };

        res.status(200).json(userProfileData);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

// Leetcode data handle
async function handleLeetcodeData(req, res) {
    try {
        const { username } = req.params;

        // leetcode user data fetching using leetcode graphQL
        const response = await axios.post(
            'https://leetcode.com/graphql',
            {
                query: `
                query getUserProfile($username: String!) {
                    matchedUser(username: $username) {
                        username
                        profile {
                            realName
                            ranking
                            userAvatar
                            reputation
                            aboutMe
                            school
                            countryName
                            company
                            skillTags
                        }
                        submitStats: submitStatsGlobal {
                            acSubmissionNum {
                                difficulty
                                count
                                submissions
                            }
                        }
                        userCalendar(year: 0) {
                            activeYears
                            streak      
                            totalActiveDays      
                            dccBadges {        
                                timestamp        
                                badge {          
                                    name          
                                    icon
                                }
                            }
                            submissionCalendar 
                        }
                        
                    }
                }
                `,
                variables: { username }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                    'Referer': `https://leetcode.com/${username}/`,
                }
            }
        );

        if (response.status === 200) {
            // leetcode userdata
            const userData = response.data.data.matchedUser;
            res.status(200).json(userData);
        } else {
            res.status(response.status).send("Error fetching data from LeetCode");
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
            const userData = nextData.props.pageProps;

            // Creating heatMap data
            const createHeatMap = userData.heatMapData.result;
            function convertHeatMapToDateAndValue(heatMap) {
                return Object.entries(heatMap).map(([date, value])=> ({
                    date,
                    value
                }));
            }
            const heatMap = convertHeatMapToDateAndValue(createHeatMap);
            
            // Extracting user contest data
            const contest_rating_data = {
                contest_user_global_rank : userData.contestData.user_global_rank,
                contest_total_users : userData.contestData.total_users,
                contest_user_position : userData.contestData.user_position,
                contest_user_stars : userData.contestData.user_stars,
                contest_current_rating : userData.contestData.user_contest_data.current_rating,
                contest_star_colour_codes : userData.contestData.star_colour_codes,
            }


            const userProfileData = {
                userHandle: userData.userHandle,
                userInfo: ({...userData.userInfo, ...contest_rating_data}),
                userSubmissionsInfo: userData.userSubmissionsInfo,
                heatMap: heatMap,
                ratingData: userData.contestData.user_contest_data.contest_data,
            }

            res.status(200).send(userProfileData);
        }
        else {
            res.status(response.status).send("Error fetching data from CodeChef");
        }

    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

module.exports = { handleRoot, handleCodeChefData, handleCodeforcesData, handleLeetcodeData, handleGFGData };