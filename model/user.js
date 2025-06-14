const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
})

const userDataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  about: { type: String },
  institute: { type: String },
  country: { type: String },
  degree: { type: String },
  branch: { type: String },
  yearofpass: { type: String },
  social: {
    linkedin: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    facebook: { type: String },
    resume: { type: String },
  },
  codechefusername: { type: String },
  codeforcesusername: { type: String },
  gfgusername: { type: String },
  leetcodeusername: { type: String },
  isVerified: { type: Boolean, default: false },
  profilePicture: { type: String },
  codingProfiles: {
    codeforces: { type: Object },
    codechef: { type: Object },
    leetcode: { type: Object },
    gfg: { type: Object }
  },
  totalProblemsSolved: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  instituteRank: { type: Number, default: 0 },
  globalRank: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });


const User = mongoose.model("user", userSchema);
const UserData = mongoose.model("userData", userDataSchema);

module.exports = { User, UserData };