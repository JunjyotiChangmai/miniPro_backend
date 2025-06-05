const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

async function validateCodeforces(req, res) {
    try {
        const { username } = req.query;
        const getUserdataUrl = `https://codeforces.com/api/user.info?handles=${username}`;

        // Geting user data from official api of Codeforces
        const userData = await fetch(getUserdataUrl).then(response => response.json()).then(data => data);

        if (userData.status === 'FAILED') return res.status(404).json({ message: 'Not found', exists: false });
        return res.status(200).json({ message: 'ok', exists: true });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}


async function validateCodechef(req, res) {
    try {
        const { username } = req.query;
        const targetUrl = `https://www.codechef.com/users/${username}`;
        const codechefAPI = `https://codechef-api.vercel.app/handle/${username}`;

        const response = await fetch(targetUrl);
        const CCProfile = await fetch(codechefAPI).then(response => response.json()).then(data => data);

        if (response.ok && CCProfile.status != 404) return res.status(200).json({ message: 'ok', exists: true });
        return res.status(404).json({ message: 'Not found', exists: false });

    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}


async function validateGFG(req, res) {
    try {
        const { username } = req.query;
        const gfgURL = `https://www.geeksforgeeks.org/user/${username}`;
        const response = await fetch(gfgURL);
        if (response.status != 404) return res.status(200).json({ message: 'ok', exists: true });
        return res.status(404).json({ message: 'Not found', exists: false });

    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}


async function validateLeetcode(req, res) {
    try {
        const { username } = req.query;
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

        if (userResponse.data.data.matchedUser === null) return res.status(404).json({ message: 'Not found', exists: false });
        return res.status(200).json({ message: 'ok', exists: true });
s
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

module.exports = { validateCodechef, validateCodeforces, validateGFG, validateLeetcode }