const FarmProduce = require('../models/farm_produce');

exports.display_tracking_information = async (req, res) => {
    try {
        const farm_produce = await FarmProduce.findById(req.params.id);
        if (!farm_produce) {
            return res.status(404).json({
                result: "fail",
                error: "Farm produce not found"
            });
        }

        const tracking_data = farm_produce.tracking_data;
        const data = {
            id: farm_produce._id,
            name: farm_produce.name,
            tracking_data
        }

        res.status(200).render('tracking/tracking_data_page', data);

    }
    catch (err) {
        res.status(500).json({
            result: "Failed",
            error: err.message
        });
    }
}

exports.display_tracking_query_page = async (req, res) => {
    res.status(200).render('tracking/tracking_query_page');
}

// Copyright to Team Proxymorons (14291) of Smart India Hackathon 2022