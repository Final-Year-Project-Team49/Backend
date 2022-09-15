const { User, roles } = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Logistic = require("../models/logistic");
const Quality_Certifier = require("../models/quality_certifier");

const { 
    create_producer,
    create_logistic,
    create_collection_center,
    create_quality_certifier,
 } = require("./populate_DB");

//----------------------Route Controllers-----------------//

// Controller for displaying the signup page
exports.display_signup_page = (req, res) => {
    data = {
        title: "Signup",
        roles: roles
    }
    res.render("signup_page", data);
}

// Controller for handling the signup request
exports.handle_signup = async (req, res) => {
    const { name, email, password, role } = req.body;
    const hashed_password = await bcrypt.hash(password, 10);

    // check if email already exists
    const email_in_DB = await User.findOne({ email: email });

    if (email_in_DB) {
        res.status(400).json({
            message: "Email already exists"
        });

    } else {
        const user = new User({
            name,
            email,
            password: hashed_password,
            role
        });

        try {
            const created_user = await user.save();

            if (role == "producer") {
                await create_producer(created_user._id);
            }
            else if (role == "logistic") {
                await create_logistic(created_user._id);
            }
            else if (role == "collection_center") {
                await create_collection_center(created_user._id);
            }
            else if (role == "quality_certifier") {
                await create_quality_certifier(created_user._id);
            }

            const token = jwt.sign({ id: created_user._id }, process.env.JWT_SECRET, {
                expiresIn: "1d"   // Change as per needed... 
            });

            res.status(200)
                .cookie("token", token)
                .json({
                    message: "User created successfully",
                    token: token,
                    user: {
                        id: created_user._id,
                        name: created_user.name,
                        email: created_user.email,
                        role: created_user.role
                    }
                });

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

// Controller for displaying the login page
exports.display_login_page = (req, res) => {
    const data = {
        title: "Login"
    }
    res.status(200).render("login_page", data);
}

// Controller for handling the login request
exports.handle_login = async (req, res) => {
    const { email, password } = req.body;

    // check if email exists
    const user = await User.findOne({ email: email });

    if (!user) {
        res.status(400).json({
            message: "Email does not exist"
        });

    } else {
        const is_password_correct = await bcrypt.compare(password, user.password);

        if (!is_password_correct) {
            res.status(400).json({
                message: "Password is incorrect"
            });

        } else {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "1d"   // Change as per needed... 
            });

            res.status(200)
                .cookie("token", token)
                .json({
                    message: "Login successful",
                    token: token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                });
        }
    }
}

//----------------------Middlewares----------------------//

// Middleware for checking if the user is authenticated
exports.check_auth = async (req, res, next) => {
    try{
        const cookie_token = req.cookies.token;
        const authorization_header_token = req.headers.authorization;

        // if token is not present in cookies and in authorization header
        if (!cookie_token && !authorization_header_token) {
            return res.status(401).json({
                message: "You are not logged in. Please Log in."
            });
        }

        // if token is present in cookies
        let token;
        if (cookie_token) {
            token = cookie_token;
        } else {
            token = authorization_header_token.split(" ")[1];
        }

        // verify the token
        const decoded_token = jwt.verify(token, process.env.JWT_SECRET);

        // if token is not valid
        if (!decoded_token) {
            return res.status(401).json({
                message: "You are not logged in. Please Log in."
            });
        }

        const user = await User.findById(decoded_token.id);

        // if user is not found
        if (!user) {
            return res.status(401).json({
                message: "You are not logged in. Please Log in."
            });
        }

        req.user = user;
        next();

    } catch (err) {
        res.status(401).json({
            message: "You are not logged in. Please Log in."
        });
    }
    
}

// Middleware for checking if the user is an admin
exports.check_admin = async (req, res, next) => {
    if (req.user.role == "admin") {
        next();
    } else {
        res.status(403).json({ message: "Forbidden. Please logout and relogin with correct role." });
    }
}

// Middleware for checking if the user is a producer
exports.check_producer = async (req, res, next) => {
    if (req.user.role == "producer") {
        next();
    } else {
        res.status(403).json({ message: "Forbidden. Please logout and relogin with correct role." });
    }
}

// Middleware for checking if the role of user is a collection center
exports.check_collection_center = async (req, res, next) => {
    if (req.user.role == "collection_center") {
        next();
    } else {
        res.status(403).json({ message: "Forbidden. Please logout and relogin with correct role." });
    }
}

// Middleware for checking if the user is a logistic partner
exports.check_logistic_partner = async (req, res, next) => {
    if (req.user.role == "logistic") {
        // find logistic of user 
        const logistic = await Logistic.findOne({ user: req.user._id });
        req.logistic = logistic;
        next();
    } else {
        res.status(403).json({ message: "Forbidden. Please logout and relogin with correct role." });
    }
}

// Middleware for checking if the user is a quality tester
exports.check_quality_certifier = async (req, res, next) => {
    if (req.user.role == "quality_certifier") {
        // find quality_certifier record of user
        const quality_certifier = await Quality_Certifier.findOne({ user: req.user._id });
        req.quality_certifier = quality_certifier;
        next();
    } else {
        res.status(403).json({ message: "Forbidden. Please logout and relogin with correct role." });
    }
}

// Middleware for checking if the user is a customer
exports.check_customer = async (req, res, next) => {
    if (req.user.role == "customer") {
        next();
    } else {
        res.status(403).json({ message: "Forbidden. Please logout and relogin with correct role." });
    }
}

// Copyright to Team Proxymorons (14291) of Smart India Hackathon 2022