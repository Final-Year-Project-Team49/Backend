const mongoose = require("mongoose");

const farm_produceSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
        default: "Na",
    },
    producer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Producer",
    },
    weight: {
        type: String,
        default: "Na",
    },
    collected: {
        type: Boolean,
        default: false,
    },
    collection_center: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Collection_Center",
    },
    tracking_data: {
        type: Array,
    },
    transaction_amount: {
        type: Number,
    },
    hardware_id: {
        type: String,
    },
    delivered: {
        type: Boolean,
        default: false,
    },
    qr_code_url: {
        type: String,
    }
    // add other fields here as needed
}, 
{ timestamps: true });

const FarmProduce = mongoose.model("FarmProduce", farm_produceSchema);

module.exports = FarmProduce;

// Copyright to Team Proxymorons (14291) of Smart India Hackathon 2022
// Contributed by Shahbaz Ali and Prateek Chaurasia