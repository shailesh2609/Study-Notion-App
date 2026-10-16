const mongoose = require("mongoose");
const Section = require("../models/Section");
const Course = require("../models/Course");

// create Section
exports.createSection = async (req, res) => {
    try {
        // fetch data
        const { sectionName, courseId } = req.body;

        // Check required fields
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Missing Properties",
            });
        }

        // Validate courseId format
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid courseId",
            });
        }

        // Find the course
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // Create a new section
        const newSection = await Section.create({
            sectionName,
        });

        // Add section ID to courseContent array
        // 1st Way : Agar tumne Course ko pehle fetch nahi kiya hai, to:
        //      const courseContentDetails = await Course.findByIdAndUpdate(
        //                                      courseId,
        //                                      {
        //                                          $push:{
        //                                              courseContent:newSection._id
        //                                          }
        //                                      },
        //                                      {new:true}
        //      );

        // 2nd Way : Agr course ko phle fetch kr rkha hai 
        course.courseContent.push(newSection._id);
        await course.save();

        return res.status(200).json({
            success: true,
            message: "Section created successfully",
            updatedCourseDetails: course,
        });
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to create Section, please try again",
            error: error.message,
        });
    }
};

// update Section
exports.updateSection = async (req, res) => {
    try {
        // fetch data
        const { sectionName, sectionId } = req.body;

        // Check required fields
        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "Missing Properties",
            });
        }

        // Validate sectionId format
        if (!mongoose.Types.ObjectId.isValid(sectionId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid sectionId",
            });
        }

        // Update section and return updated document
        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            { sectionName },
            { new: true }
        );

        if (!updatedSection) {
            return res.status(404).json({
                success: false,
                message: "Section not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Section Updated Successfully",
            updatedSection,
        });
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to update Section, please try again",
            error: error.message,
        });
    }
};

// delete Section
exports.deleteSection = async (req, res) => {
    try {
        const { courseId, sectionId } = req.body;

        // Validate IDs
        if (
            !mongoose.Types.ObjectId.isValid(courseId) ||
            !mongoose.Types.ObjectId.isValid(sectionId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid courseId or sectionId",
            });
        }

        // Check whether the course contains this section
        const course = await Course.findOne({
            _id: courseId,
            courseContent: sectionId,
        });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course or section association not found",
            });
        }

        // Remove section ID from courseContent
        await Course.updateOne(
            { _id: courseId },
            {
                $pull: {
                    courseContent: sectionId,
                },
            }
        );

        // Delete the section document
        const section = await Section.findByIdAndDelete(sectionId);

        if (!section) {
            return res.status(404).json({
                success: false,
                message: "Section not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Section deleted successfully",
        });
    } catch (error) {
        console.error("Delete section error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to delete section, please try again",
            error: error.message,
        });
    }
};
