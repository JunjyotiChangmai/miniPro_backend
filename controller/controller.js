const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function handleRoot(req, res) {
    res.status(200).json("6th Sem MiniPro...");
}

// Codechef data handle
async function handleCodeChefData(username) {
    try {
        const targetUrl = `https://www.codechef.com/users/${username}`;
        const response = await fetch(targetUrl);

        if (response.ok) {
            const d = await response.text();
            const data = { data: d };
            const dom = new JSDOM(data.data);
            const document = dom.window.document;

            //to extract total problem solved count
            const problemSolvedElement = document.querySelector('.rating-data-section.problems-solved').lastElementChild;
            const totalProb = problemSolvedElement.innerHTML.split(" ")[3];

            //to extract heatmap data
            const script = [...document.scripts].find(s => s.textContent.includes("userDailySubmissionsStats"));
            const match = script.textContent.match(/userDailySubmissionsStats\s*=\s*(\[[^\]]*\])/);
            const heatMapData = match ? JSON.parse(match[1]) : [];

            //to extract rating data
            const ratingScript = [...document.scripts].find(s => s.textContent.includes("all_rating"));
            const ratingMatch = ratingScript?.textContent.match(/all_rating\s*=\s*(\[[\s\S]*?\]);/);
            const ratingData = ratingMatch ? JSON.parse(ratingMatch[1]) : [];

            //Extraction basic user details
            const profile = document.querySelector(".user-details-container").children[0].children[0].src;
            const name = document.querySelector(".user-details-container").children[0].children[1].textContent;
            const currentRating = parseInt(document.querySelector(".rating-number")?.textContent);
            const highestRating = parseInt(document.querySelector(".rating-number")?.parentNode?.children[4]?.textContent?.split("Rating")[1]);
            const countryFlag = document.querySelector(".user-country-flag").src;
            const countryName = document.querySelector(".user-country-name").textContent;
            const globalRank = parseInt(document.querySelector(".rating-ranks")?.children[0]?.children[0]?.children[0]?.children[0]?.innerHTML);
            const countryRank = parseInt(document.querySelector(".rating-ranks")?.children[0]?.children[1]?.children[0]?.children[0]?.innerHTML);
            const stars = document.querySelector(".rating")?.textContent || "unrated";

            //final user data that is going to return
            const userProfileData = {
                profile,
                name,
                currentRating,
                highestRating,
                countryFlag,
                countryName,
                countryRank,
                globalRank,
                stars,
                problemSolved: parseInt(totalProb),
                heatMap: heatMapData,
                ratingData: ratingData,
            };
            return userProfileData;

        }
        else {
            return { "message": "not found", "status": 404 };
        }
    } catch (error) {
        return { "message": "not found", "status": 404 };
    }
}

// Codeforce data handle
async function handleCodeforcesData(username) {
    // Official API of Codeforces
    const getUserdataUrl = `https://codeforces.com/api/user.info?handles=${username}`;
    const userSubmissionHistoryUrl = `https://codeforces.com/api/user.status?handle=${username}&from=1`;
    const userRatingListUrl = `https://codeforces.com/api/user.rating?handle=${username}`;

    // Geting user data from official api of Codeforces
    const userData = await fetch(getUserdataUrl).then(response => response.json()).then(data => data);

    if (userData.status === 'FAILED') {
        return { "message": "not found", "status": 404 };
    }

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


    const targetUrl = `https://codeforces.com/profile/${username}`;
    const response = await fetch(targetUrl);
    const d = await response.text();
    const data = { data: d };
    const dom = new JSDOM(data.data);
    const document = dom.window.document;
    const problemSolvedElement = document.querySelector('._UserActivityFrame_counterValue').innerHTML.split(" ")[0];


    const problemSolved = parseInt(problemSolvedElement);

    const userProfileData = {
        userInfo: userData.result,
        heatMap: heatMapData,
        ratingData: userRatingList.result,
    };

    userProfileData.userInfo[0].problemSolved = problemSolved || 0

    return userProfileData;
}

// Leetcode data handle
async function handleLeetcodeData(username) {
    // leetcode user data fetching using leetcode graphQL
    const userResponse = await axios.post(
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
                        tagProblemCounts {
                            advanced {
                                tagName
                                problemsSolved
                            }
                            intermediate {
                                tagName
                                problemsSolved
                            }
                            fundamental {
                                tagName
                                problemsSolved
                            }
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

    if (userResponse.data.data.matchedUser === null) {
        return { "message": "not found", "status": 404 };
    }

    // leetcode user contest data fetching using leetcode graphQL
    const contetResponse = await axios.post(
        'https://leetcode.com/graphql',
        {
            query: `
                    query getUserContestRankingInfo($username: String!) {
                        userContestRanking(username: $username) {
                            attendedContestsCount
                            rating
                            globalRanking
                            totalParticipants
                            topPercentage
                            badge {
                                name
                                icon
                            }
                        }
                        userContestRankingHistory(username: $username) {
                            attended
                            trendDirection
                            problemsSolved
                            totalProblems
                            finishTimeInSeconds
                            rating
                            ranking
                            contest {
                                title
                                startTime
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

    if (contetResponse.data.data.matchedUser === null) {
        return { "message": "not found", "status": 404 };
    }

    // leetcode userdata
    const userResData = userResponse.data.data.matchedUser;
    const userContestResData = contetResponse.data.data;

    const userProfileData = ({ ...userResData, ...userContestResData });


    userProfileData.profile.problemSolved = userProfileData.submitStats.acSubmissionNum.find(
        stat => stat.difficulty === 'All'
    )?.count || 0;

    return userProfileData;
}

// GFG data handle
async function handleGFGData(username) {
    const gfgURL = `https://www.geeksforgeeks.org/user/${username}`;

    const response = await fetch(gfgURL);

    if (response.status != 404) {
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
            return Object.entries(heatMap).map(([date, value]) => ({
                date,
                value
            }));
        }
        const heatMap = convertHeatMapToDateAndValue(createHeatMap);

        // Extracting user contest data
        const contest_rating_data = {
            contest_user_global_rank: userData.contestData.user_global_rank,
            contest_total_users: userData.contestData.total_users,
            contest_user_position: userData.contestData.user_position,
            contest_user_stars: userData.contestData.user_stars,
            contest_current_rating: userData.contestData.user_contest_data.current_rating,
            contest_star_colour_codes: userData.contestData.star_colour_codes,
        }

        const userHandle = {
            userHandle: userData.userHandle,
        }

        const userProfileData = {
            userInfo: ({ ...userHandle, ...userData.userInfo, ...contest_rating_data }),
            userSubmissionsInfo: userData.userSubmissionsInfo,
            heatMap: heatMap,
            ratingData: userData.contestData.user_contest_data.contest_data,
        }

        return userProfileData;
    }
    else {
        return {"message": "not found", "status": 404};
    }
}

module.exports = { handleRoot, handleCodeChefData, handleCodeforcesData, handleLeetcodeData, handleGFGData };