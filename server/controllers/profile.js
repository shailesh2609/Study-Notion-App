const Profile = require("../models/Profile");
const User = require("../models/User");



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

        // Schedule deletion after 5 hours
        const deletionTime = new Date(
            Date.now() + 5 * 60 * 60 * 1000
        );

        userDetails.accountStatus = "pending_deletion";
        userDetails.deletionScheduledAt = deletionTime;

        await userDetails.save();

        return res.status(200).json({
            success: true,
            message: "Account deletion scheduled after 5 hours",
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
