const { authentication } = require("../Middleware/userauth");
const express = require("express");
const User = require("../Models/User"); // ✅ Capital U
const alluser = express.Router();

alluser.get("/alluser", authentication, async (req, res) => {
    try {
        // console.log("req.user:", req.user);

        const user = await User.find({}).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);

    } catch (err) {
        res.status(500).json({ message: `Error: ${err}` });
    }
});

module.exports = alluser;