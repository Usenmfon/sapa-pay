const mongoose = require("mongoose")

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        fullname: { type: String, required: [true, 'enter a fullname'] },
        username: { type: String, required: [true, 'enter a user name'] },
        email: { type: String, required: [true, 'enter an email '] },
        password: { type: String, required: [true, 'enter a password '] },
        sex: { type: String},
        businessName: { type: String},
        phoneNumber: { type: String},
        referral: { type: String },
        count: { type: Number, default: 0 },
        isAdmin: { type: Boolean, default: false },


        roles: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        }]
    })
)

module.exports = User