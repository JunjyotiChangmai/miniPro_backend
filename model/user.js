const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username : { type : String, required : true, unique: true},
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true},
    institute: { type: String },
    isVerified: { type: Boolean, default: false },
    profilePicture: { type: String },
    codingProfiles: {
      codeforces: { type: Object },
      codechef: { type: Object },
      leetcode: { type: Object },
      gfg: { type: Object }
    },
    totalProblemsSolved: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  }, { timestamps: true });
  

const User = mongoose.model("user", userSchema);

module.exports = User;