const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const { check_auth } = require("./auth_controller");

exports.redirection_controller = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        const data = {
            title: "Home"
        }
        console.log("no token");
        return res.status(200).render("index", data);
    }
    try {
        const decoded_token = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded_token.id);

        if (!user) {
            const data = {
                title: "Home"
            }
            console.log("invalid token");
            return res.status(200).render("index", data);
        }
        console.log("redirected");
        res.status(300).redirect(user.role);

    } catch (err) {
        console.log("error:", err.message);
        const data = {
            title: "Home"
        }
        return res.status(200).render("index", data);
    }
}

// Copyright to Team Proxymorons (14291) of Smart India Hackathon 2022