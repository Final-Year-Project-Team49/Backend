const mongoose = require("mongoose");

const producerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    address : {
        type : String
    },
    pincode : {
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

const Producer = mongoose.model("Producer", producerSchema );

module.exports = Producer ;

// Copyright to Team Proxymorons (14291) of Smart India Hackathon 2022
// Contributed by Shahbaz Ali and Prateek Chaurasia