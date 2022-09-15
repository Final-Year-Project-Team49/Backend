const router = require("express").Router();
const { body, param } = require("express-validator");
const { request_validator } = require("../utils/validator");

const {
    check_auth,
    check_quality_certifier,
} = require("../controllers/auth_controller");

const {
    display_quality_certifier_page,
    display_update_info_page,
    update_info,
    display_certify_page,
    certify_produce
} = require("../controllers/quality_certifier_controller");

// route to display quality_certifier page
router.get("/",
    check_auth,
    check_quality_certifier,
    display_quality_certifier_page
);

//route to display update_info page
router.get("/update_info",
    check_auth,
    check_quality_certifier,
    display_update_info_page
);

//route to handle update_info page
router.post("/update_info",
    check_auth,
    check_quality_certifier,
    [
        body("quality_certifier_name").exists().withMessage("Quality Certifier Name is required"),
        body("address").exists().withMessage("Address is required"),
        body("pincode").exists().withMessage("Pincode is required"),
    ],
    request_validator,
    update_info
)

// route to display quality_certify page
router.get("/certify/:produce_id",
    check_auth,
    check_quality_certifier,
    display_certify_page
);

// route to handle quality_certify page
router.post("/certify/:produce_id",
    check_auth,
    check_quality_certifier,
    [
        param("produce_id").exists().withMessage("Produce ID is required"),
        body("certification_id").exists().withMessage("Certification ID is required"),
        body("remarks").exists().withMessage("Remark is required"),
    ],
    request_validator,
    certify_produce,
)

module.exports = router;

// Copyright to Team Proxymorons (14291) of Smart India Hackathon 2022