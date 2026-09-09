const mongoose = require("mongoose");
const SubSection = require("../models/Subsection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

// Create SubSection
exports.createSubSection = async (req, res) => {
    try {
        // Fetch data from request body
        const {
            sectionId,
            title,
            timeDuration,
            description
        } = req.body;

        // Extract video
        const video = req.files?.videoFile;

        // Validation
        if (!sectionId || !title || !timeDuration || !description || !video) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Validate sectionId
        if (!mongoose.Types.ObjectId.isValid(sectionId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid sectionId",
            });
        }

        // Check if section exists
        const section = await Section.findById(sectionId);

        if (!section) {
            return res.status(404).json({
                success: false,
                message: "Section not found",
            });
        }

        // Prepare update data
        const updateData = {
            title,
            timeDuration,
            description,
        };

        // If a new video was uploaded
        if (video) {
            const uploadDetails = await uploadImageToCloudinary(
                video,
                process.env.FOLDER_NAME
            );

            updateData.videoUrl = uploadDetails.secure_url;
        }


        // Create SubSection
        const subSectionDetails = await SubSection.create(updateData);

        // Add SubSection ID to Section
        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            {
                $push: {
                    subSection: subSectionDetails._id,
                },
            },
            { new: true }
        )


        // Response
        return res.status(200).json({
            success: true,
            message: "Sub Section Created Successfully",
            updatedSection,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};


// update Sub Section
exports.updateSubSection = async (req, res) => {
    try {
        // Fetch data
        const {
            subSectionId,
            title,
            timeDuration,
            description
        } = req.body;

        // Extract video
        const video = req.files?.videoFile;

        // Check required fields
        if (!subSectionId || !title || !timeDuration || !description) {
            return res.status(400).json({
                success: false,
                message: "Missing Properties",
            });
        }

        // Validate subSectionId
        if (!mongoose.Types.ObjectId.isValid(subSectionId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid subSectionId",
            });
        }

        // Prepare update data
        const updateData = {
            title,
            timeDuration,
            description,
        };

        // If a new video was uploaded, upload it to Cloudinary
        if (video) {
            const uploadDetails = await uploadImageToCloudinary(
                video,
                process.env.FOLDER_NAME
            );

            updateData.videoUrl = uploadDetails.secure_url;
        }

        // Update SubSection
        const updatedSubSection = await SubSection.findByIdAndUpdate(
            subSectionId,
            updateData,
            { new: true }
        );

        // Check if SubSection exists
        if (!updatedSubSection) {
            return res.status(404).json({
                success: false,
                message: "Sub Section not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Sub Section Updated Successfully",
            updatedSubSection,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to update Sub Section, please try again",
            error: error.message,
        });
    }
};


// delete Sub Section
exports.deleteSubSection = async (req, res) => {
    try {
        // fetch data
        const { subSectionId } = req.params;

        // Validate subSectionId format
        if (!mongoose.Types.ObjectId.isValid(subSectionId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid subSectionId",
            });
        }

        // Delete sub section from Section collection
        const subSection = await SubSection.findByIdAndDelete(subSectionId);

        if (!subSection) {
            return res.status(404).json({
                success: false,
                message: "Sub Section not found",
            });
        }

        // Remove deleted sub section ID from section array
        await Section.updateOne(
            { subSection: subSectionId },
            {
                $pull: {
                    subSection: subSectionId,
                },
            }
        );

        return res.status(200).json({
            success: true,
            message: "Sub Section Deleted Successfully",
        });
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to delete Sub Section, please try again",
            error: error.message,
        });
    }
};