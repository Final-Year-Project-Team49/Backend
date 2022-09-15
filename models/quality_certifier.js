const mongoose = require("mongoose");

const quality_certifier_schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    city: {
        type: String,
    },
    state_code: {
        type: String,
    },
    address: {
        type: String
    },
    pincode: {
        type: String
    },
    quality_certifier_name: {
        type: String
    },
    details_updated : {
        type: Boolean,
        default: false
    },
    details_verified : {
        type: Boolean,
        default: false
    }
},
    { timestamps: true });

module.exports =  mongoose.model("Quality_Certifier", quality_certifier_schema);

// Copyright to Team Proxymorons (14291) of Smart India Hackathon 2022
// Contributed by Shahbaz Ali and Prateek Chaurasia