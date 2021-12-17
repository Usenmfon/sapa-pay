const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async(req, res) => {

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

    if (req.body.referral) {
        const referral = await User.findOne({ id: req.body.referral, }).catch(() => {

        })
        referral.count += 1
        referral.save()
    }

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

exports.signin = (req, res) => {
    User.findOne({
            email: req.body.email
        })
        .exec((err, user) => {
            if (err) {
                res.status(400).send({ message: err });
                return;
            }

            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            var authorities = [];

            res.status(200).send({
                id: user._id,
                email: user.email,
                accessToken: token
            });
        });
};