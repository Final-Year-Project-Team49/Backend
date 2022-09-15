const mongoose = require("mongoose");

const collection_center_schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    collection_center_name: {
        type: String
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

// convention to start model name with capital letters.
const Collection_Center = mongoose.model("Collection_Center", collection_center_schema );

module.exports = Collection_Center ;

// Copyright to Team Proxymorons (14291) of Smart India Hackathon 2022
// Contributed by Shahbaz Ali and Prateek Chaurasia