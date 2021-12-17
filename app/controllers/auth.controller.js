const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {

    // Email
    User.findOne({
        email: req.body.email,
    }).exec((err, user) => {
        if (err) {
            res.status(400).send({ message: err });
            return;
        }

        if (user) {
            res.status(400).send({ message: "Failed! Email is already in use!" });
            return;
        }
    });

    const user = new User({
        email: req.body.email,
        fullname: req.body.fullname,
        password: bcrypt.hashSync(req.body.password, 8)
    });

    user.save().catch(e => {

        res.status(400).send({ success: false, data: e })
    })

    var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
    });

    res.status(200).send({
        id: user._id,
        email: user.email,
        accessToken: token
    });
};