const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password)
            return res.status(400).json({ msg: "All fields required" });

        const exists = await User.findOne({ email });
        if (exists)
            return res.status(400).json({ msg: "User already exists" });

        const hashed = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashed
        });

        await user.save();

        res.json({ msg: "User registered successfully" });

    } catch (err) {
        console.error("REGISTER ERROR:", err);
        res.status(500).json({ msg: "Server error" });
    }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ msg: "Invalid email" });

        const match = await bcrypt.compare(password, user.password);
        if (!match)
            return res.status(400).json({ msg: "Wrong password" });

        // 🔥 IMPORTANT: convert _id to STRING
        const payload = {
            id: user._id.toString(),
            email: user.email,
            name: user.name
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "7d" } // longer so no random logout
        );

        res.json({
            token,
            name: user.name
        });

    } catch (err) {
        console.error("LOGIN ERROR:", err);
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;