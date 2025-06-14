const { UserData } = require("../model/user");
const { handleCodeChefData, handleCodeforcesData, handleGFGData, handleLeetcodeData } = require("./controller");

// To send all user data to the client
async function handleUserData(req, res) {
    try {
        const { username } = req.params;
        const userdata = await UserData.find({ username });

        res.status(200).json(userdata);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

// to update user profile data
async function addCodingProfileData(req, res) {
    try {
        const { username, codechefusername, codeforcesusername, gfgusername, leetcodeusername } = req.body;
        const userdata = await UserData.findOne({ username });

        if (!userdata) {
            return res.status(404).json({ message: "User not found" });
        }

        if (codechefusername) userdata.codechefusername = codechefusername;
        if (codeforcesusername) userdata.codeforcesusername = codeforcesusername;
        if (gfgusername) userdata.gfgusername = gfgusername;
        if (leetcodeusername) userdata.leetcodeusername = leetcodeusername;

        await userdata.save();

        res.status(200).json({ message: "added" });

    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

//to update personal details
async function updateDetails(req, res) {
    try {
        const { username, name, about, country, institute, degree, branch, yearofpass } = req.body;
        const userdata = await UserData.findOne({ username });

        if (!userdata) {
            return res.status(404).json({ message: "User not found" });
        }

        if (name) userdata.name = name;
        if (about) userdata.about = about;
        if (country) userdata.country = country;
        if (institute) userdata.institute = institute;
        if (degree) userdata.degree = degree;
        if (branch) userdata.branch = branch;
        if (yearofpass) userdata.yearofpass = yearofpass;

        await userdata.save();

        res.status(200).json({ message: "added" });

    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

//tp add social media accounts
async function addSocialMedia(req, res) {
    try {
        const { username, linkedin, twitter, instagram, facebook, resume } = req.body;
        const userdata = await UserData.findOne({ username });

        if (!userdata) {
            return res.status(404).json({ message: "User not found" });
        }

        if (linkedin) userdata.social.linkedin = linkedin;
        if (twitter) userdata.social.twitter = twitter;
        if (instagram) userdata.social.instagram = instagram;
        if (facebook) userdata.social.facebook = facebook;
        if (resume) userdata.social.resume = resume;

        await userdata.save();

        res.status(200).json({ message: "added" });

    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

// to update coding profile data
async function updateUserCodingProfile(req, res) {
    try {
        const { username } = req.params;
        const userdata = await UserData.findOne({ username });

        if (!userdata) {
            return res.status(404).json({ message: "User not found" });
        }

        let totalProblemSolved = 0;

        //Score calculation
        let codechefScore = 0;
        let codeforcesScore = 0;
        let leetcodeScore = 0;
        let gfgScore = 0;

        if (userdata.codechefusername) {
            try {
                const codechefData = await handleCodeChefData(userdata.codechefusername);

                if(codechefData.status === 404) {
                    userdata.codechefusername = undefined;
                    userdata.codingProfiles.codechef = undefined;
                }
                else {
                    userdata.codingProfiles.codechef = codechefData;
                    totalProblemSolved += codechefData.problemSolved;
                    //score
                    codechefScore = 2 * codechefData.problemSolved;
                }
            } catch (error) {
                console.log(error)
            }
        }

        if (userdata.codeforcesusername) {
            try {   
                const codeforcesData = await handleCodeforcesData(userdata.codeforcesusername);

                if(codeforcesData.status === 404) {
                    userdata.codeforcesusername = undefined;
                    userdata.codingProfiles.codeforces = undefined;
                }
                else {
                    userdata.codingProfiles.codeforces = codeforcesData;
                    totalProblemSolved += codeforcesData.userInfo[0].problemSolved;
                    //score
                    codeforcesScore = 2 * codeforcesData.userInfo[0].problemSolved;
                }
            } catch (error) {
                console.log(error)
            }
        }

        if (userdata.gfgusername) {
            try {
                const gfgData = await handleGFGData(userdata.gfgusername);

                if(gfgData.status === 404) {
                    userdata.gfgusername = undefined;
                    userdata.codingProfiles.gfg = undefined;
                }
                else {
                    userdata.codingProfiles.gfg = gfgData;
                    totalProblemSolved += gfgData.userInfo.total_problems_solved;
        
                    const gfgEasyScore = 1 * ( gfgData?.userSubmissionsInfo?.Easy ? Object.keys(gfgData.userSubmissionsInfo.Easy).length : 0 );
                    const gfgMediumScore = 2 * ( gfgData?.userSubmissionsInfo?.Medium ? Object.keys(gfgData.userSubmissionsInfo.Medium).length : 0 );
                    const gfgHardScore = 4 * ( gfgData?.userSubmissionsInfo?.Hard ? Object.keys(gfgData.userSubmissionsInfo.Hard).length : 0 );
        
                    gfgScore = gfgEasyScore + gfgMediumScore + gfgHardScore;
                }
            }
            catch(err) {
                console.log(err);
            }
        }

        if (userdata.leetcodeusername) {
            try {
                const leetcodeData = await handleLeetcodeData(userdata.leetcodeusername);

                if(leetcodeData.status === 404) {
                    userdata.leetcodeusername = undefined;
                    userdata.codingProfiles.leetcode = undefined;
                }
                else {
                    userdata.codingProfiles.leetcode = leetcodeData;
                    totalProblemSolved += leetcodeData.profile.problemSolved;
        
                    const leetcodeEasyScore = 1 * (leetcodeData?.submitStats?.acSubmissionNum[1]?.count ? leetcodeData.submitStats.acSubmissionNum[1].count : 0);
                    const leetcodeMediumScore = 2 * (leetcodeData?.submitStats?.acSubmissionNum[2]?.count ? leetcodeData.submitStats.acSubmissionNum[2].count : 0);
                    const leetcodeHardScore = 4 * (leetcodeData?.submitStats?.acSubmissionNum[3]?.count ? leetcodeData.submitStats.acSubmissionNum[3].count : 0);
        
                    leetcodeScore = leetcodeEasyScore + leetcodeMediumScore + leetcodeHardScore;
                }
            } catch (error) {
                console.log(error)
            }
        }

        userdata.totalProblemsSolved = totalProblemSolved;
        userdata.score = codechefScore + codeforcesScore + leetcodeScore + gfgScore;

        await userdata.save();

        res.status(200).json(userdata);

    } catch (error) {
        res.status(500).send("Internal Server Error", error);
    }
}

module.exports = { handleUserData, updateUserCodingProfile, addCodingProfileData, addSocialMedia, updateDetails };