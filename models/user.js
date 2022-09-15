const mongoose = require("mongoose");

const roles = ["producer", "collection_center", "logistic", "quality_certifier", "customer"];

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: roles,
        default: "user",
    }
}
    , { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = { User, roles };

// Copyright to Team Proxymorons (14291) of Smart India Hackathon 2022
// Contributed by Shahbaz Ali and Prateek Chaurasia
