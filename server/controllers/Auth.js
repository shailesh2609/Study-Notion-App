const User = require("../models/User");
const OTP = require("../models/OTP");
// const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Profile = require("../models/Profile");
require("dotenv").config();
const mailSender = require("../utils/mailSender");


// send OTP -> Handler Function
exports.sendOTP = async (req, res) => {
    try {
        // fetch email from req ki body, remove the extra spaces and convert to lowercase
        const email = req.body.email?.trim().toLowerCase();

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        // check whether User already exist or not 
        const userExists = await User.findOne({ email });

        // if user exists -> return a response
        if (userExists) {
            return res.status(409).json({
                success: false,
                message: "User Already Registered"
            });
        }

        // Generate otp -> using crypto (Node.js built-in module)
        const otp = crypto.randomInt(100000, 1000000).toString();

        // Alternate way to generate OTP : using otp-generator library
            // const otp = otpGenerator.generate(6,{
            //     upperCaseAlphabets:false,
            //     lowerCaseAlphabets:false,
            //     specialChars:false
            // });

            // check unique otp or not -> otp must be unique
                // const result = await OTP.findOne({otp});

                // while(result){
                //     otp = otpGenerator.generate(6,{
                //         upperCaseAlphabets:false,
                //         lowerCaseAlphabets:false,
                //         specialChars:false
                //     });
                //     result = await OTP.findOne({otp:otp});
                // }

        // create an entry for otp in db
        await OTP.create({ email, otp });

        // return response successfully
        return res.status(200).json({
            success: true,
            message: "OTP Sent Successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "OTP creation failed"
        });
    }
};


// signup -> Handler Function
exports.signup = async (req, res) => {
    try{
        // data fetch from request ki body
        const {
            firstName, 
            lastName, 
            email, 
            password, 
            confirmPassword, 
            accountType, 
            contactNumber, 
            otp 
        } = req.body;

        // validate krlo
        if(!firstName || !lastName || !email || !password || !accountType || !confirmPassword || !contactNumber || !otp){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // match both the password fields
        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password and ConfirmPassword Values does not matched, please try again"
            });
        }

        // check user aready exist or not
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(409).json({
                success: false,
                message: "User Already Registered"
            });
        }

        // Find most recent OTP stored for the user
        const recentOtp = await OTP.findOne({email})        // .find() always return an array
                                   .sort({createdAt:-1});   // -1 means: Newest → Oldest                
        console.log(recentOtp);

        // validate OTP
        if(!recentOtp){
            // OTP not found
            return res.status(400).json({
                success: false,
                message: "OTP Not Found"
            });
        }
        if(recentOtp.otp !== otp){
            // Invalid OTP
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password,10);


        const profileDetails = await Profile.create({
           gender:null,
           dateOfBirth:null,
           about:null,
           contactNumber:null  
        });
        // Create Entry in DB
        const user = await User.create({
            firstName, 
            lastName, 
            email, 
            password:hashedPassword, 
            accountType, 
            contactNumber,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`
        });

        // return response 
        return res.status(201).json({
            success: true,
            message: "User is Registered Successfully"
        });
    }
    catch(error){
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "User is not registered , please try again"
        }); 
    }
}


// login -> Handler Function
exports.login = async (req, res) => {
    try{
        // data fetch from request ki body
        const {email, password} = req.body;

        // validate krlo
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // check whether user exist or not 
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                success: false,
                message: "User doesn't Exist, Please Signup first"
            });
        }

        // Verify password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password"
            });
        }

        // Generate JWT token
        const payload = {
            email : user.email,
            accountType: user.accountType
        }
        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET,
            {
                expiresIn:'2h'
            }
        )

        user.token = token;
        
        // Remove password from response
        user.password = undefined; 

        // Create cookie
        const options = {
            expires: new Date(Date.now() + 3*24*60*60*1000),  // 3 days
            httpOnly: true
        }
        return res.cookie("cookie", token, options).status(200).json({
            success:true,
            token,
            user,
            message:"User Logged In Successfully"
        })
        
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Login failure, Please Try again later"
        })
    }
}


// changePassword -> Handler Function
exports.changePassword = async (req, res) => {
    try{
        // get user data from request ki body
        const userDetails = await User.findById(req.user.id);

        // Get old password, new password, and confirm new password from req.body
        const {currentPassword, newPassword, confirmNewPassword} = req.body;

        // validation
        const isPasswordMatch = await bcrypt.compare(currentPassword, userDetails.password );

        if(!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res.status(401).json({ 
                success: false, 
                message: "The password is incorrect" 
            });
		}

        // match both the password fields
        if(newPassword !== confirmNewPassword){
            return res.status(400).json({
                success: false,
                message: "Password and ConfirmPassword Values does not matched, please try again"
            });
        }

        // Update password
        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUserDetails = await User.findByIdAndUpdate(
            req.user.id,
            { password: encryptedPassword },
            { new: true }
        );

        // send notification email
        try{
            // ??
        }
        catch(error){
            // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
        }

        // Return success response
		return res.status(200).json({ 
                success: true, 
                message: "Password updated successfully" 
            });

    }
    catch(error){
        // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
    }
}