const jwt = require("jsonwebtoken");
require("dotenv").config();

// auth 
exports.auth = (req,res,next) => {
    try{
        // extract token
        const token = req.body?.token ||
                    req.cookies?.token ||
                    req.header("Authorization")?.replace("Bearer ","");

        // check whether token is missing 
        if(!token || token === undefined){
            return res.status(401).json({
                success: false,
                message: "Token is Missing"
            });
        }

        // verify token 
        try{
            const payload = jwt.verify(token, process.env.JWT_SECRET);

            user.req = payload;
        }
        catch(error){
            return res.status(401).json({
                success:false,
                message:'Token is invalid'
            });
        }
        next(); // to go to next middleware
    }
    catch(error){
        console.error(error);
        return res.status(401).json({
            success:false,
            message:'Something Went Wrong while verifying token'
        });
    }
}


// isStudent
exports.isStudent = async(req,res,next) => {
    try{
        if(req.user.accountType != "Student"){
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Student'
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'User Role is not matching'
        });
    }
}


// isInstructor
exports.isInstructor = async(req,res,next) => {
    try{
        if(req.user.accountType != "Instructor"){
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Instructor'
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'User Role is not matching'
        });
    }
}


// isAdmin
exports.isAdmin = (req,res,next) => {
    try{
        if(req.user.accountType != "Admin"){
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Admin'
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'User Role is not matching'
        });
    }
}