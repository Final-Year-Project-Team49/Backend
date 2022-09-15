const FarmProduce = require("../models/farm_produce");
const { record_tracking_data } = require("../utils/record_tracking_data");

// display logistic page
exports.display_logistic_page = async (req, res) => {
    try {
        const logistic = req.logistic;

        const { _id, name, email, role } = req.user;
        const data = {
            title: "Logistics",
            user: { _id, name, email, role },
            logistic
        }
        res.render("logistic/logistic_page", data);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// display update info page
exports.display_update_info_page = async (req, res) => {
    try {
        const logistic = req.logistic;
        const { _id, name, email, role } = req.user;
        const data = {
            title: "Update Info",
            user: { _id, name, email, role },
            logistic
        }
        res.render("logistic/update_info", data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// handle update info request
exports.logistic_update_info = async (req, res) => {
    const { address, city, state_code, pincode, company_name } = req.body;

    try {
        const logistic = req.logistic;

        logistic.address = address;
        logistic.city = city;
        logistic.state_code = state_code;
        logistic.pincode = pincode;
        logistic.company_name = company_name;
        logistic.details_updated = true;

        await logistic.save();

        res.status(200).json({
            result: "success",
            message: "Updated Successfully"
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// handle update tracking info request
exports.append_tracking_data = async (req, res) => {
    try{
        const { farm_produce_id } = req.params;
        const { company_name, city, state_code, pincode, address } = req.logistic;
        const { notes } = req.body;
        const { type } = req.query;

        let event = "";
        if (type === "arrival") {
            event = `Reached ${city}, ${state_code}`;
        } else {
            event = `Departed ${city}, ${state_code}`;
        }

        try {
            const tracking_data = {
                Event : event,
                timestamp : Date.now(),
                company_name: company_name,
                address: address,
                city: city,
                code: state_code,
                pincode: pincode,
                notes: notes,
            }
            await record_tracking_data(farm_produce_id, tracking_data);

        } catch (error) {
        // id not found
            return res.status(404).json({
                result: "fail",
                message: "id not found"
            });
        }
        res.status(200).json({
            result: "success",
            message: "Updated Successfully"
        });
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
}

// Copyright to Team Proxymorons (14291) of Smart India Hackathon 2022