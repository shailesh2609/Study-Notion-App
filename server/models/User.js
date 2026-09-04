const mongoose  = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        trim: true,
        required: true
    },
    lastName:{
        type: String,
        trim: true,
        required: true
    },
    email:{
        type: String,
        trim: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    confirmPassword:{
        type: String,
        required: true
    },
    contactNumber:{
        type: Number,
        required: true
    },
    accountType:{
        type:String,
        enum:["Admin", "Student", "Instructor"],
        required: true
    },
    additionalDetails:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : "Profile"
    },
    courses: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Course"
        }
    ],
    image:{
        type: String,
        required: true,
    },
    token : {
        type:string
    },
    resetPasswordExpires:{
        type:Date
    },
    courseProgress:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : "CourseProgress"
        }
    ]

});

module.exports = mongoose.model("User", userSchema);