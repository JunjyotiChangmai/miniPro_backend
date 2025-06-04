const { UserData } = require("../model/user");
const { handleCodeChefData, handleCodeforcesData, handleGFGData, handleLeetcodeData } = require("./controller");

// To send all user data to the client
async function handleUserData(req, res) {
    try {
        const { username } = req.params;
        const userdata = await UserData.find({username});
        
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

        if(codechefusername) userdata.codechefusername = codechefusername;
        if(codeforcesusername) userdata.codeforcesusername = codeforcesusername;
        if(gfgusername) userdata.gfgusername = gfgusername;
        if(leetcodeusername) userdata.leetcodeusername = leetcodeusername;

        await userdata.save();

        res.status(200).json({message: "added"});

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

        if(name) userdata.name = name;
        if(about) userdata.about = about;
        if(country) userdata.country = country;
        if(institute) userdata.institute = institute;
        if(degree) userdata.degree = degree;
        if(branch) userdata.branch = branch;
        if(yearofpass) userdata.yearofpass = yearofpass;

        await userdata.save();

        res.status(200).json({message: "added"});

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

        if(linkedin) userdata.social.linkedin = linkedin;
        if(twitter) userdata.social.twitter = twitter;
        if(instagram) userdata.social.instagram = instagram;
        if(facebook) userdata.social.facebook = facebook;
        if(resume) userdata.social.resume = resume;

        await userdata.save();

        res.status(200).json({message: "added"});

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

        if (userdata.codechefusername) {
            const codechefData = await handleCodeChefData(userdata.codechefusername);
            userdata.codingProfiles.codechef = codechefData;
            totalProblemSolved += codechefData.problemSolved;
        }

        if (userdata.codeforcesusername) {
            const codeforcesData = await handleCodeforcesData(userdata.codeforcesusername);
            userdata.codingProfiles.codeforces = codeforcesData;
            totalProblemSolved += codeforcesData.userInfo[0].problemSolved;
        }

        if (userdata.gfgusername) {
            const gfgData = await handleGFGData(userdata.gfgusername);
            userdata.codingProfiles.gfg = gfgData;
            totalProblemSolved += gfgData.userInfo.total_problems_solved;
        }

        if (userdata.leetcodeusername) {
            const leetcodeData = await handleLeetcodeData(userdata.leetcodeusername);
            userdata.codingProfiles.leetcode = leetcodeData;
            totalProblemSolved += leetcodeData.profile.problemSolved;
        }

        userdata.totalProblemsSolved = totalProblemSolved;
        
        await userdata.save();
        
        res.status(200).json(userdata);

    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

module.exports = { handleUserData, updateUserCodingProfile, addCodingProfileData, addSocialMedia, updateDetails };