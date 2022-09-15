const mongoose = require("mongoose");

const hardwareSchema = new mongoose.Schema({
    hardware_name: {
        type: String,
        required: true,
    },
    hardware_type: {
        type: String,
    },
    hardware_id: {
        type: String,
        required: true,
        unique: true,
    },
    collection_center_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Collection_Center",
        required: true,
    },
    status: {
        type: String,
        enum: ["idle", "occupied"],
        default: "idle",
    },
    hardware_description: {
        type: String,
    },
    hardware_secret_key: {
        type: String,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model("Hardware", hardwareSchema);

// Copyright to Team Proxymorons (14291) of Smart India Hackathon 2022
// Contributed by Shahbaz Ali and Prateek Chaurasia