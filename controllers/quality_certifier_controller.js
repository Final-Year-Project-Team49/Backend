const FarmProduce = require("../models/farm_produce");
const { record_tracking_data } = require("../utils/record_tracking_data");
const { Quality_Certifier } = require("../models/quality_certifier");
const { route } = require("../routes/quality_certifier_routes");

exports.display_quality_certifier_page = async (req, res) => {
    try {
        const quality_certifier = req.quality_certifier;

        const { _id, name, email, role } = req.user;
        const data = {
            title: "Quality Certifier",
            user: { _id, name, email, role },
            quality_certifier
        }
        res.render("quality_certifier/quality_certifier_page", data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// route to display update info page
exports.display_update_info_page = async (req, res) => {
    try {
        const quality_certifier = req.quality_certifier;
        const { _id, name, email, role } = req.user;
        const data = {
            title: "Update Info",
            user: { _id, name, email, role },
            quality_certifier
        }
        res.render("quality_certifier/update_info_page", data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// route to update the quality certifier info
exports.update_info = async (req, res) => {
    const { address, city, state_code, pincode, quality_certifier_name } = req.body;

    try {
        const quality_certifier = req.quality_certifier;

        quality_certifier.address = address;
        quality_certifier.city = city;
        quality_certifier.state_code = state_code;
        quality_certifier.pincode = pincode;
        quality_certifier.quality_certifier_name = quality_certifier_name;
        quality_certifier.details_updated = true;

        await quality_certifier.save();

        res.status(200).json({
            result: "success",
            message: "Updated Successfully"
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// route to display certify page
exports.display_certify_page = async (req, res) => {
    try {
        const { produce_id } = req.params;
        const quality_certifier = req.quality_certifier;
        const { _id, name, email, role } = req.user;
        const data = {
            title: "Certify",
            user: { _id, name, email, role },
            produce_id,
            quality_certifier
        }
        res.render("quality_certifier/certify_page", data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// route to certify the produce
exports.certify_produce = async (req, res) => {
    try{
        const { produce_id }= req.params ;
        const { quality_certifier_name } = req.quality_certifier;
        const {certification_id, remarks} = req.body;

        const tracking_data = {
            Event : `Got certification from ${quality_certifier_name}`,
            timestamp : Date.now(),
            certifier_name : quality_certifier_name,
            certification_id,
            remarks
        }

        await record_tracking_data(produce_id, tracking_data);

        res.status(200).json({
            result: "success",
            message: "Certified Successfully"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Copyright to Team Proxymorons (14291) of Smart India Hackathon 2022