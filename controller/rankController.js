const cron = require('node-cron');
const { UserData } = require('../model/user'); // Adjust the path if needed

// Rank update function
async function updateRanks() {
    const users = await UserData.find().sort({ score: -1 });

    // Global rank
    for (let i = 0; i < users.length; i++) {
        users[i].globalRank = i + 1;
        await users[i].save();
    }

    // Institute rank
    const usersByInstitute = {};
    users.forEach(user => {
        const inst = user.institute || 'Unknown';
        if (!usersByInstitute[inst]) usersByInstitute[inst] = [];
        usersByInstitute[inst].push(user);
    });

    for (const inst in usersByInstitute) {
        const group = usersByInstitute[inst];
        for (let i = 0; i < group.length; i++) {
            group[i].instituteRank = i + 1;
            await group[i].save();
        }
    }

    console.log(`[RANK UPDATE] ${new Date().toLocaleString()} - Ranks updated.`);
}


// Runs at 12:00 AM and 12:00 PM every day
cron.schedule('0 */4 * * *', async () => {
    console.log('Starting scheduled rank update...');
    await updateRanks();
});

async function handleLeaderBoard(req, res) {
    try {
        const usersData = await UserData.find().sort({ globalRank: 1 });
        res.status(200).json(usersData);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {handleLeaderBoard};
