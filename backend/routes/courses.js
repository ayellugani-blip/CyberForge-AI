const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

// GET all courses
router.get("/", async (req, res) => {
    const courses = await Course.find({});
    res.json(courses);
});

// GET single course
router.get("/:id", async (req, res) => {
    const course = await Course.findById(req.params.id);
    res.json(course);
});

module.exports = router;