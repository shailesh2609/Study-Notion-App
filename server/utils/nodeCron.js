const cron = require("node-cron");
const User = require("../models/User");
const Profile = require("../models/Profile");

// Run the account deletion job at the beginning of every hour.
// Cron format: "0 * * * *"
// This means: At minute 0 of every hour (e.g., 1:00, 2:00, 3:00, etc.)
cron.schedule("0 * * * *", async () => {
    try {
        // Find all users who:
        // 1. Have requested account deletion
        // 2. Their scheduled deletion time has already arrived or passed
        const users = await User.find({
            accountStatus: "pending_deletion",
            deletionScheduledAt: {
                $lte: new Date() // Current date/time
            }
        });

        // Process each user whose deletion time has arrived
        for (const user of users) {

            // If the user has an associated profile,
            // delete that profile first.
            if (user.additionalDetails) {
                await Profile.findByIdAndDelete(
                    user.additionalDetails
                );
            }

            // Delete the user account from the User collection.
            await User.findByIdAndDelete(user._id);

            // Log the deleted user's ID for monitoring/debugging.
            console.log(`Deleted user ${user._id}`);
        }

    } catch (error) {
        // Handle and log any error that occurs during
        // the account deletion process.
        console.error("Account deletion error:", error);
    }
});
