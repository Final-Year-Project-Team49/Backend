const { validationResult } = require('express-validator');

exports.request_validator = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
}

// Copyright to Team Proxymorons (14291) of Smart India Hackathon 2022