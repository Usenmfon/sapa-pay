const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

function getToken(user) {
    return jwt.sign({ id: user._id, isAdmin: user.isAdmin, fullname: user.fullname, username: user.username }, config.secret, {
        expiresIn: 86400 // 24 hours
    });
}

exports.signup = async(req, res) => {

    // Email
    const tempUser = await User.findOne({
        email: req.body.email,
    })

    // console.log(tempUser)

    if (tempUser) {
        res.status(400).json({ message: "failed user exist" })
        return
    }

    if (req.body.referral) {
        const referral = await User.findOne({ username: req.body.referral, }).catch(() => {

        })
        referral.count += 1

        referral.save()
        // console.log(referral)
    }

    const user = new User({
        email: req.body.email,
        fullname: req.body.fullname,
        username: req.body.username,
        sex: req.body.sex,
        businessName: req.body.businessName,
        phoneNumber: req.body.phoneNumber,
        password: bcrypt.hashSync(req.body.password, 8)
    });

    try{
        user.save()

    var token = getToken(user)

    res.status(200).send({
        id: user._id,
        email: user.email,
        username: user.username,
        accessToken: token
    });

    }catch(e) {

       res.status(400).send({ success: false, data: e })
    }
    
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

            var token = getToken(user)

            // var authorities = [];

            res.status(200).send({
                id: user._id,
                email: user.email,
                accessToken: token
            });
        });
};