const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const mongoose = require("mongoose");

// create rating and review handler function
exports.createRating = async (req, res) => {
    try {
        // Get authenticated user's ID
        const userId = req.user.id;

        // Get data from request body
        const { rating, review, courseId } = req.body;

        // Validate required fields
        if (!rating || !review || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Rating, review and courseId are required",
            });
        }

        // Validate course ID
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID",
            });
        }

        // Validate rating
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5",
            });
        }

        // Check whether user is enrolled in the course
        const courseDetails = await Course.findOne({
            _id: courseId,
            studentsEnrolled: userId,
        });

        if (!courseDetails) {
            return res.status(403).json({
                success: false,
                message: "Student is not enrolled in the course",
            });
        }

        // Check whether user has already reviewed the course
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId,
        });

        if (alreadyReviewed) {
            return res.status(409).json({
                success: false,
                message: "Course is already reviewed by the user",
            });
        }

        // Create rating and review
        const ratingReview = await RatingAndReview.create({
            rating,
            review,
            course: courseId,
            user: userId,
        });

        // Add review reference to course
        await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    ratingAndReviews: ratingReview._id,
                },
            }
        );

        // Send response
        return res.status(201).json({
            success: true,
            message: "Rating and Review created successfully",
            ratingReview,
        });

    } catch (error) {
        console.error("Error creating rating:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create rating and review",
        });
    }
};



// get Average rating handler function
exports.getAverageRating = async (req, res) => {
    try {
        // Get course ID 
        const { courseId } = req.body;

        // Validate course ID
        if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID",
            });
        }

        // Calculate average rating using aggregate() 
        const result = await RatingAndReview.aggregate([
            // stage 1 : filtering all reviews based on particular Course(Sirf kisi particular Course ki ratings select karo)
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId),     // string ko MongoDB ke ObjectId mein convert karta hai
                    // request se aane wala courseId string hota hai, lekin database mein course field ObjectId ho sakti hai. Isliye hum ID ko ObjectId mein convert karte hain
                },
            },
            // stage 2 : Jo documents $match se mile hain, unko group karo
            {
                $group: {
                    _id: null,     // _id: null mtlb Saare matched reviews ko ek hi group mein daal do
                    averageRating: {
                        $round: [                   //  $round mtlb  Average ko 1 decimal place tak round karo
                            { $avg: "$rating" },    // $avg: "$rating" ka matlab hai database mein jo rating ki values hain, unka average nikaalo.
                            1
                        ],
                    },
                    totalReviews: {
                        $sum: 1,         // mtlb Har document ke liye 1 add karo
                    },
                },
            },
        ]);

        // Aggregation ka result array mein aata hai.
        //      Example:
        //      const result = [
        //          {
        //              _id: null,
        //              averageRating: 4,
        //              totalReviews: 3
        //          }
        //      ];
        //          result = poora array.
        //          result[0] = array ke andar pehla object.
        //          result[0].averageRating = 4.
        //          result[0].totalReviews = 3.


        // No reviews
        if (result.length === 0) {
            return res.status(200).json({
                success: true,
                averageRating: 0,
                totalReviews: 0,
                message: "No ratings given yet",
            });
        }

        // Return average rating
        return res.status(200).json({
            success: true,
            averageRating: result[0].averageRating,      // Notice karo result array hai, object nahi thats why result[0].averageRating 
            totalReviews: result[0].totalReviews,
        });

    } catch (error) {
        console.error("Error getting average rating:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get average rating",
        });
    }
};


// get all ratings handler function
exports.getAllRating = async (req, res) => {
    try {
        // Get all reviews
        const allReviews = await RatingAndReview.find({})
            .sort({ rating: -1 })     // sort in descending order(5 star phle )
            .populate({
                path: "user",
                select: "firstName lastName image",
            })
            .populate({
                path: "course",
                select: "courseName",
            });

        // No reviews found
        if (allReviews.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No reviews found",
                data: [],
            });
        }

        // Return reviews
        return res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            data: allReviews,
        });

    } catch (error) {
        console.error("Error fetching reviews:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch reviews",
        });
    }
};
