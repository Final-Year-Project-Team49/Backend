const mongoose = require("mongoose");
const Producer = require("../models/producer");
const FarmProduce = require("../models/farm_produce");
const { qr_code_link_generator } = require("../utils/qr_code_link_generator");
const { record_tracking_data } = require("../utils/record_tracking_data");

// controller for displaying the producer page
exports.display_producer_page = async (req, res) => {
    // find the producer by the user id
    try {
        const producer = await Producer.findOne({
            user: req.user._id
        });

        // find all farm produces by the producer id
        const farm_produces_by_producer = await FarmProduce.find({
            producer: producer._id
        }).populate(["producer", "collection_center"]);


        // Caution : Below code might cause problems 
        // because mongoose doesnt return the object in JSON form
        const { _id, name, email, role } = req.user;
        const { address, pincode, details_updated, details_verified } = producer;
        data = {
            title: "Producer",
            user: {_id, name, email, role},
            producer: {address, pincode, details_updated, details_verified},
            farm_produces_by_producer: farm_produces_by_producer, // will be an array
        }
        res.render("producer/producer_page", data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.display_update_info_page = async (req, res) => {

    const { _id, name, email, role } = req.user;
    let data = {
        title: "Producer",
        user: { _id, name, email, role }
    }

    try {
        
        const producer = await Producer.findOne({
            user: req.user._id
        });
        data.producer = producer;

    } catch (error) {
        data.producer = null;
    }

    res.render("producer/update_info", data);

}

// controller for updating the producer details
exports.producer_update_info = async (req, res, next) => {
    const { address, pincode } = req.body;

    // find the producer by the user id
    try {
        const producer = await Producer.findOne({
            user: req.user._id
        });

        // update the producer info 
        producer.address = address;
        producer.pincode = pincode;
        producer.details_updated = true;

        // save the producer info
        await producer.save();

        // redirect to the producer page
        res.status(200).json({
            result: "Success",
            message: "Producer info updated successfully",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// controller for displaying the farm produce registration page
exports.display_farm_produce_registration_page = async (req, res) => {
    // find the producer by the user id
    try {
        const producer = await Producer.findOne({
            user: req.user._id
        });

        // Caution : Below code might cause problems 
        // because mongoose doesnt return the object in JSON form
        const { _id, name, email, role } = req.user;
        const { address, pincode, details_updated, details_verified } = producer;
        data = {
            title: "Farm Produce Registration",
            user: {_id, name, email, role},
            producer: {address, pincode, details_updated, details_verified},
        }
        res.render("producer/farm_produce_registration_page", data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// controller for registering the farm produce
exports.register_farm_produce = async (req, res, next) => {
    // find the producer by the user id
    try {
        const { name, description, weight } = req.body;

        // find producer 
        const producer = await Producer.findOne({
            user: req.user._id
        }).populate("user");

        console.log(producer);

        // create a new farm produce
        const farm_produce = new FarmProduce({
            name: name,
            description: description,
            producer: producer._id,
            weight: weight,
        });

        // save the farm produce
        const saved_farm_produce = await farm_produce.save();

        // double save after id is assigned

        // generate and save qr code url
        const link = `${process.env.HOST_URL}/track/${saved_farm_produce._id}`;
        const qr_code_link = await qr_code_link_generator(500, 500, link);
        saved_farm_produce.qr_code_url = qr_code_link;

        // append registration data to the tracking data
        const registration_data = {
            Event: "Registration",
            timestamp: Date.now(),
            name: name,
            description: saved_farm_produce.description,
            producer: producer.user.name,
            registered_at_pincode: producer.pincode,
            weight: weight
        }

        await record_tracking_data(saved_farm_produce._id, registration_data);

        await saved_farm_produce.save();

        res.status(200).json({
            result: "Success",
            message: "Farm produce registered successfully",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Copyright to Team Proxymorons (14291) of Smart India Hackathon 2022