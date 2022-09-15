const Collection_Center = require("../models/collection_center");
const FarmProduce = require("../models/farm_produce");
const Hardware = require("../models/hardware");
const { record_tracking_data } = require("../utils/record_tracking_data");

exports.display_collection_center_page = async (req, res) => {
    try {
        // collection center details
        const collection_center = await Collection_Center.findOne({ user: req.user._id });
        // all farm produce registered by this collection center 
        const collected_farm_produces = await FarmProduce.find({ collection_center: collection_center._id }).populate({path: "producer", populate: {path: "user", model: "User"}});
        // all hardware registered by this collection center
        const registered_hardwares = await Hardware.find({ collection_center: collection_center._id });
        const { _id, name, email, role } = req.user;
        const { collection_center_name, address, pincode, details_updated, details_verified } = collection_center;
        const data = {
            title: "Collection Center",
            user: { _id, name, email, role },
            collection_center : { collection_center_name, address, pincode, details_updated, details_verified },
            collected_farm_produces,
            registered_hardwares,
        }
        res.render("collection_center/collection_center_page", data);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// displays the update info page
exports.display_update_info_page = async (req, res) => {
    try {
        const collection_center = await Collection_Center.findOne({ user: req.user._id });
        const { collection_center_name, address, pincode, details_updated, details_verified } = collection_center;
        const { _id, name, email, role } = req.user;

        const data = {
            title: "Update Collection Center Info",
            user: { _id, name, email, role },
            collection_center: { collection_center_name, address, pincode, details_updated, details_verified },
        }
        res.render("collection_center/update_info", data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.collection_center_update_info = async (req, res) => {
    const { collection_center_name, address, pincode } = req.body;

    try {
        const collection_center = await Collection_Center.findOne({ user: req.user._id });

        collection_center.collection_center_name = collection_center_name;
        collection_center.address = address;
        collection_center.pincode = pincode;
        collection_center.details_updated = true;

        await collection_center.save();

        res.status(200).json({
            result: "success",
            message: "Updated Successfully"
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.display_collect_farm_produce_page = async (req, res) => {
    try {
        const farm_produce_id = req.params.farm_produce_id;
        // collection center details
        const collection_center = await Collection_Center.findOne({ user: req.user._id });
        
        // find the farm produce
        const farm_produce = await FarmProduce.findOne({ _id: farm_produce_id }).populate("producer");

        if(!farm_produce) {
            return res.status(400).json({
                error: "bad request",
                message: "Invalid Product ID"
            });
        }

        const { _id, name, email, role } = req.user;
        const { collection_center_name, address, pincode, details_updated, details_verified } = collection_center;

        const data = {
            title: "Collect Farm Produce",
            user: { _id, name, email, role },
            collection_center : { collection_center_name, address, pincode, details_updated, details_verified },
            farm_produce,
        }
        res.render("collection_center/collect_farm_produce_page", data);

    } catch (err) {
        res.status(500).json({ error: err.message, message: "Invalid Product ID" });
    }
}

//handle farm produce collection
exports.collect_farm_produce = async (req, res) => {
    try {
        const { farm_produce_id } = req.params;
        const { transaction_amount , notes, hardware_id } = req.body;
        // find the farm produce
        const farm_produce = await FarmProduce.findById(farm_produce_id);
        const collection_center = await Collection_Center.findOne({ user: req.user._id });
        
        // if farm produce is not found
        if (!farm_produce) {
            return res.status(404).json({
                result: "failed",
                message: "Farm Produce not found"
            });
        }

        // check if the farm produce is already collected by this collection center
        if(farm_produce.collected === true){
            return res.status(400).json({
                result: "failed",
                message: "This farm produce is already collected"
            });
        }

        farm_produce.collection_center = collection_center._id;
        farm_produce.transaction_amount = transaction_amount;
        farm_produce.hardware_id = hardware_id;
        farm_produce.collected = true;

        // record the tracking data
        const tracking_data = {
            Event: "Farm Produce Collected",
            timestamp: Date.now(),
            collection_center_id: collection_center._id,
            collection_center_name: collection_center.collection_center_name,
            transaction_amount: transaction_amount,
            notes: notes,
        }

        await record_tracking_data(farm_produce._id, tracking_data);

        if (hardware_id) {
            const hardware = await Hardware.findOne({ hardware_id: hardware_id });
            if (!hardware) {
                return res.status(400).json({
                    result: "fail",
                    message: "Invalid Hardware ID"
                });
            }

            if (hardware.status === "occupied") {
                return res.status(400).json({
                    result: "fail",
                    message: "Hardware is already occupied"
                });
            }

            hardware.status = "occupied";

            await hardware.save();

            const tracking_data_2 = {
                Event: "Hardware attached to track realtime data",
                timestamp: Date.now(),
                collection_center_id: collection_center._id,
                collection_center_name: collection_center.collection_center_name,
                hardware_id: hardware_id,
            }
            await record_tracking_data(farm_produce._id, tracking_data_2);
        }

        await farm_produce.save();
        res.status(200).json({
            result: "success",
            url: "/collection_center/info/" + farm_produce_id,
            message: "Collected Successfully"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// this controller displayes the details of collected farm produce like QR code
exports.display_collected_farm_produce_info = async (req, res) => {
    try {
        const farm_produce_id = req.params.farm_produce_id;
        // collection center details
        const collection_center = await Collection_Center.findOne({ user: req.user._id });
        
        // find the farm produce
        const farm_produce = await FarmProduce.findOne({ _id: farm_produce_id }).populate("producer");

        const { _id, name, email, role } = req.user;
        const { collection_center_name, address, pincode, details_updated, details_verified } = collection_center;

        const data = {
            title: farm_produce.name,
            user: { _id, name, email, role },
            collection_center : { collection_center_name, address, pincode, details_updated, details_verified },
            farm_produce,
        }
        res.render("collection_center/print_QR_code_page", data);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


// this controller displays register hardware page
exports.display_register_hardware_page = async (req, res) => {
    try {
        const collection_center = await Collection_Center.findOne({ user: req.user._id });
        const { collection_center_name, address, pincode, details_updated, details_verified } = collection_center;
        const { _id, name, email, role } = req.user;

        const data = {
            title: "Register Hardware",
            user: { _id, name, email, role },
            collection_center: { collection_center_name, address, pincode, details_updated, details_verified },
        }
        res.render("collection_center/register_hardware", data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// this controller handles hardware registration
exports.register_hardware = async (req, res) => {
    try {
        const { hardware_id, hardware_name, hardware_secret_key, hardware_type, hardware_description } = req.body;
        const collection_center = await Collection_Center.findOne({ user: req.user._id });

        // check if the hardware is already registered
        const hardware = await Hardware.findOne({ hardware_id });
        if(hardware){
            return res.status(400).json({
                result: "fail",
                message: "Hardware id already registered"
            });
        }

        // create the hardware
        const hardware_data = {
            hardware_id,
            hardware_name,
            hardware_secret_key,
            hardware_type,
            hardware_description,
            collection_center_id: collection_center._id,
        }

        await Hardware.create(hardware_data);

        res.status(200).json({
            result: "success",
            message: "Hardware Registered Successfully"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Copyright to Team Proxymorons (14291) of Smart India Hackathon 2022
