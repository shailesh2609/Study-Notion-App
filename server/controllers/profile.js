const Profile = require("../models/Profile");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");


// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
    try {
        const {
            dateOfBirth = "",
            about = "",
            contactNumber,
            gender
        } = req.body;

        const userId = req.user.id;

        // Validation
        if (!userId || !contactNumber || !gender) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided",
            });
        }

        // Find user
        const userDetails = await User.findById(userId);

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Find profile
        const profileDetails = await Profile.findById(
            userDetails.additionalDetails
        );

        if (!profileDetails) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        // Update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;

        await profileDetails.save();

        return res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            profileDetails,
        });

    } catch (error) {
        console.error("Update profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update profile",
            error: error.message,
        });
    }
};


// DELETE ACCOUNT - SCHEDULE(5 hours) -> using node-cron package
exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find user
        const userDetails = await User.findById(userId);

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check if deletion is already scheduled
        if (userDetails.accountStatus === "pending_deletion") {
            return res.status(400).json({
                success: false,
                message: "Account deletion is already scheduled",
                deletionScheduledAt: userDetails.deletionScheduledAt,
            });
        }

        // Schedule deletion after 10 sec
        const deletionTime = new Date(
            Date.now() + 10 * 1000
        );

        userDetails.accountStatus = "pending_deletion";
        userDetails.deletionScheduledAt = deletionTime;

        await userDetails.save();

        return res.status(200).json({
            success: true,
            message: "Account deletion scheduled after 10 sec",
            deletionScheduledAt: deletionTime,
        });

    } catch (error) {
        console.error("Delete account error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to schedule account deletion",
            error: error.message,
        });
    }
};


// GET USER DETAILS
exports.getAllUserDetails = async (req, res) => {
    try {
        const userId = req.user.id;

        const userDetails = await User.findById(userId)
            .populate("additionalDetails")
            .exec();

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User Data Fetched Successfully",
            userDetails,
        });

    } catch (error) {
        console.error("Get user details error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch user details",
            error: error.message,
        });
    }
};


// UPDATE DISPLAY PICTURE
exports.updateDisplayPicture = async (req, res) => {
    try {
        // Get user ID from authenticated user
        const userId = req.user.id;

        // Check whether image was uploaded
        if (!req.files || !req.files.displayPicture) {
            return res.status(400).json({
                success: false,
                message: "Please upload a display picture",
            });
        }

        const displayPicture = req.files.displayPicture;

        // Upload image to Cloudinary
        const image = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        );

        // Update user's profile picture
        const updatedProfile = await User.findByIdAndUpdate(
            userId,
            {
                image: image.secure_url,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        // Check user
        if (!updatedProfile) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Send response
        return res.status(200).json({
            success: true,
            message: "Image updated successfully",
            data: updatedProfile,
        });

    } catch (error) {
        console.error("Error updating display picture:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update display picture",
        });
    }
};


// GET ENROLLED COURSES
exports.getEnrolledCourses = async (req, res) => {
    try {
        // Get authenticated user's ID
        const userId = req.user.id;

        // Find user and populate enrolled courses
        const userDetails = await User.findById(userId)
            .populate("courses");

        // Check if user exists
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: `Could not find user with id: ${userId}`,
            });
        }

        // Return enrolled courses
        return res.status(200).json({
            success: true,
            data: userDetails.courses,
        });

    } catch (error) {
        console.error("Error fetching enrolled courses:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch enrolled courses",
        });
    }
};
