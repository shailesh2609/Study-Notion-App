const User = require("../models/User");
const crypto = require('crypto');
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

// resetPasswordToken
exports.resetPasswordToken = async(req,res) => {
    try{
        // get email from req body
        const email = req.body.email;

        // check user for this email
        const user = await User.findOne({email});    // .findOne() expects a MongoDB query object
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User doesn't Exist, Please Signup first"
            });
        }

        // generate token
        const token = crypto.randomUUID();
        
        // update user by adding token and expiration time  --> Why ?
        const updatedDetails = await User.findOneAndUpdate(
                                        {email},
                                        {
                                            token:token,
                                            resetPasswordExpires: Date.now() + 5*60*1000
                                        },
                                        {new:true}       
        )

        // create url
        const url = `https://localhost:3000/update-password/${token}`;

        // send mail containing the url
        const response = await mailSender(updatedDetails.email,
                                        "Reset Password Link Generated",
                                        `Reset password link : ${url}`
        )

        return res.status(200).json({
			success: true,
			message:"Email Sent Successfully, Please Check Your Email to Continue Further",
		});
    }
    catch(error){
        return res.status(500).json({
			error: error.message,
			success: false,
			message: `Some Error in Sending the Reset Message`,
		});
    }
}


// resetPassword
exports.resetPassword = async(req,res) => {
    try {
    // Get password, confirm password, and reset token from request body
    const { password, confirmPassword, token} = req.body;

    // Check if both passwords match
    if (confirmPassword !== password) {
        return res.status(400).json({
            success: false,
            message: "Password and Confirm Password Does not Match",
        });
    }

    // Find the user associated with the reset token
    const userDetails = await User.findOne({ token: token });

    // Token does not exist or is invalid
    if (!userDetails) {
        return res.status(404).json({
            success: false,
            message: "Token is Invalid",
        });
    }

    // Check whether the reset token has expired
    if (userDetails.resetPasswordExpires < Date.now()) {
        return res.status(403).json({
            success: false,
            message: "Token is Expired, Please Regenerate Your Token",
        });
    }

    // Hash the new password before storing it in the database
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    await User.findOneAndUpdate(
        { token: token },
        { password: encryptedPassword },
        { new: true }
    );

    // Password reset completed successfully
    return res.status(200).json({
        success: true,
        message: "Password Reset Successful",
    });

} catch (error) {
    // Handle unexpected server/database errors
    return res.status(500).json({
        error: error.message,
        success: false,
        message: "Some Error in Updating the Password",
    });
}
}