const User = require("../models/user.model");

exports.getUsers = async(req, res) => {
    const user = await User.find();
    res.status(200).json({ success: true, data: user });
}