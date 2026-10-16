const mongoose  = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseName:{
        type: String,
        trim:true,
        required: true
    },
    courseDescription:{
        type: String,
        trim:true,
        required: true
    },
    instructor:{
        type: mongoose.Schema.Types.ObjectId,
        ref : "User", 
        required: true
    },
    whatYouWillLearn:{
        type:String,
        trim:true
    },
    courseContent:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : "Section", 
        }
    ],
    ratingAndReviews:[ 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : "RatingAndReview", 
        }
    ],
    price:{
        type: Number,
        required: true,
        min: 0
    },
    thumbnail:{
        type:String
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref : "Category", 
    },
    tag: [
        {
            type: String,
            trim: true
        }
    ],
    studentsEnrolled:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : "User", 
        } 
    ],
    status:{
        type:String,
        enum:["Draft", "Published"]
    }
    
});

module.exports = mongoose.model("Course", courseSchema);