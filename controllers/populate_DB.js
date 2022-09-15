const Producer = require("../models/producer");
const Logistic = require("../models/logistic");
const Collection_Center = require("../models/collection_center");
const Quality_Certifier = require("../models/quality_certifier");

// create a blank producer object
exports.create_producer = async (user_id) => {
    return new Promise(async (resolve, reject) => {

        const producer = new Producer({
            user: user_id,
            address: "",
            pincode: ""
        });

        // save the blank producer object
        try {
            const created_producer = await producer.save();
            resolve(created_producer);

        } catch (error) {
            reject(error);
        }
    }
    );
}

// create a blank logistic record
exports.create_logistic = async (user_id) => {
    return new Promise(async (resolve, reject) => {

        const logistic = new Logistic({
            user: user_id,
            address: "",
            pincode: "",
            company_name: ""
        });

        try {
            const created_logistic = await logistic.save();
            resolve(created_logistic);

        } catch (error) {
            reject(error);
        }
    }
    );
}

// Create a blank Collection_Center record.
exports.create_collection_center = async (user_id) => {
    return new Promise(async (resolve, reject) => {

        const collection_center = new Collection_Center({
            user: user_id,
            name: "",
            address: "",
            pincode: ""
        });

        // save the blank producer object
        try {
            const created_collection_center = await collection_center.save();
            resolve(created_collection_center);

        } catch (error) {
            reject(error);
        }
    }
    );
}

exports.create_quality_certifier = async (user_id) => {
    return new Promise(async (resolve, reject) => {

        const quality_certifier = new Quality_Certifier({
            user: user_id,
            city: "",
            state_code: "",
            adress: "",
            pincode: "",
            quality_certifier_name: ""
        });

        // save the blank producer object
        try {
            const created_quality_certifier = await quality_certifier.save();
            resolve(created_quality_certifier);

        } catch (error) {
            reject(error);
        }
    }
    );
}

// Copyright to Team Proxymorons (14291) of Smart India Hackathon 2022