const User = require("../models/user.model");

exports.getUsers = async(req, res) => {
    const user = await User.find();
    res.status(200).json({ success: true, data: user });
}

exports.getUser = async(req, res) => {
    const { id } = req.params;

    const user = await User.findOne({ _id: id });
    res.status(200).json({ success: true, data: user });
};