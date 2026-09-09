const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const uploadImageToCloudinary = require("../utils/imageUploader");
const mongoose = require("mongoose");

//createCourse handler function
exports.createCourse = async (req, res) => {
    try {

        //fetch data 
        const {courseName, 
            courseDescription,
            whatYouWillLearn,
            price,
            category} = req.body;

        //get thumbnail
        const thumbnail = req.files?.thumbnailImage;

        //validation
        if(!courseName ||
            !courseDescription ||
            !whatYouWillLearn ||
            price == undefined ||
            price === null ||
            !category ||
            !thumbnail) {
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        }

        // Validate price -> checks that price (number hai aur negative nahi hai)
        if (isNaN(price) || Number(price) < 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid course price",
            });
        }

        // Validate category ID
        if (!mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category ID",
            });
        }

        //check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Details: " , instructorDetails);
        //TODO: Verify that userId and instructorDetails._id  are same or different ?
        // Answer : Yes they both are same .... so we can simply remove findById() call and 
        //          just pass instructor: userId._id inside Course.create({}) db call

        if(!instructorDetails) {
            return res.status(404).json({
                success:false,
                message:'Instructor Details not found',
            });
        }

        //check given tag is valid or not
        const categoryDetails = await Tag.findById(tag);
        if(!categoryDetails) {
            return res.status(404).json({
                success:false,
                message:'Category Details not found',
            });
        }

        //Upload Image top Cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        //create an entry for new Course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            category:categoryDetails._id,
            thumbnail:thumbnailImage.secure_url,
        })

        //add the new course to the user schema of Instructor
        await User.findByIdAndUpdate(
            instructorDetails._id,
            {
                $push: {                    // push -> Push karo, duplicate ki tension nahi
                    courses: newCourse._id,
                }
            },
            {new:true},
        );

        // Add course to category
        await Category.findByIdAndUpdate(
            categoryDetails._id,
            {
                $addToSet: {                // addToSet -> Add karo, but duplicate nahi
                    courses: newCourse._id,
                },
            }
        );

        //return response
        return res.status(201).json({
            success:true,
            message:"Course Created Successfully",
            data:newCourse,
        });

    }
    catch(error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to create Course',
            error: error.message,
        })
    }
};


//getAllCourses handler function
exports.showAllCourses = async (req, res) => {
    try {
            //TODO: change the below statement incrementally
            const allCourses = await Course.find({});

            return res.status(200).json({
                success:true,
                message:"Course data fetched successfully",
                data:allCourses,
            })

    }
    catch(error) {
        console.log("Get all courses error:", error);
        return res.status(500).json({
            success:false,
            message:'Cannot Fetch course data',
            error:error.message,
        })
    }
}


// getCourseDetails handler function
exports.getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body;

        // Validate courseId
        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course ID is required",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID",
            });
        }

        // Find course details
        const courseDetails = await Course.findById(courseId)
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec();

        // Course not found
        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: `Could not find the course with ID ${courseId}`,
            });
        }

        // Return response
        return res.status(200).json({
            success: true,
            message: "Course details fetched successfully",
            data: courseDetails,
        });
    } catch (error) {
        console.error("Error fetching course details:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch course details",
        });
    }
};
