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
            totalProblemSolved += codechefData.totalProblemSolved;
        }

        if (userdata.codeforcesusername) {
            const codeforcesData = await handleCodeforcesData(userdata.codeforcesusername);
            userdata.codingProfiles.codeforces = codeforcesData;
            totalProblemSolved += codeforcesData.totalProblemSolved;
        }

        if (userdata.gfgusername) {
            const gfgData = await handleGFGData(userdata.gfgusername);
            userdata.codingProfiles.gfg = gfgData;
            totalProblemSolved += gfgData.totalProblemSolved;
        }

        if (userdata.leetcodeusername) {
            const leetcodeData = await handleLeetcodeData(userdata.leetcodeusername);
            userdata.codingProfiles.leetcode = leetcodeData;
            totalProblemSolved += leetcodeData.totalProblemSolved;
        }

        userdata.totalProblemSolved = totalProblemSolved;
        await userdata.save();

        return res.status(200).json({
            message: "Coding profile updated successfully",
            user: userdata
        });

    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

module.exports = { handleUserData, updateUserCodingProfile, addCodingProfileData };