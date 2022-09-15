const router = require("express").Router();
const { body, param, query } = require("express-validator");
const { request_validator } = require("../utils/validator");
const { 
    check_auth, 
    check_logistic_partner, 
} = require('../controllers/auth_controller');
const { 
    display_logistic_page, 
    logistic_update_info, 
    display_update_info_page, 
    append_tracking_data
} = require("../controllers/logistic_controller");

//render logistic page
router.get("/",
    check_auth,
    check_logistic_partner,
    display_logistic_page
);

//render update info page
router.get("/update_info",
    check_auth,
    check_logistic_partner,
    display_update_info_page,
);

// handle update info request
router.post("/update_info",
    check_auth,
    check_logistic_partner,
    [
        body("address").exists().withMessage("Address is required"),
        body("city").exists().withMessage("City is required"),
        body("state_code").exists().withMessage("State code is required"),
        body("pincode").exists().withMessage("Pincode is required"),
        body("company_name").exists().withMessage("Company name is required")
    ],
    request_validator,
    logistic_update_info
);

router.post("/update/:farm_produce_id",
    check_auth,
    check_logistic_partner,
    [
        // if notes is empty, then it will be set to "Normal"
        body("notes").default("None"),
        query("type").default("arrival"),
        param("farm_produce_id").exists().withMessage("Farm produce id is required")
    ],
    request_validator,
    append_tracking_data,
);

module.exports = router;

// Copyright to Team Proxymorons (14291) of Smart India Hackathon 2022