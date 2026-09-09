const Category = require("../models/Category");
const mongoose = require("mongoose");

// Create Category handler function
exports.createCategory = async (req, res) => {
    try {
        // Fetch data
        const { name, description } = req.body;

        // Validation
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Check if category already exists
        const existingCategory = await Tag.findOne({ name });

        if (existingCategory) {
            return res.status(409).json({
                success: false,
                message: "Category already exists",
            });
        }

        // Create entry in DB
        const categoryDetails = await Category.create({
            name,
            description
        });

        // Return response
        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            tag: categoryDetails,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};



// Get all categories handler function
exports.showAllCategories = async (req, res) => {
    try {
        const allCategories = await Category.find()
            .select("name description");

        // Same functionality as above code
        // const allCategories = await Category.find(
        //                      {}, 
        //                      { 
        //                        name: true, 
        //                        description: true 
        //                      }
        // );
    

        return res.status(200).json({
            success: true,
            message: "All categories returned successfully",
            allCategories,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};



// get Category Details handler function
exports.categoryPageDetails = async (req, res) => {
    try {
        // Get category ID
        const { categoryId } = req.body;

        // Validate category ID
        if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category ID",
            });
        }

        // Get selected category with its courses
        const selectedCategory = await Category.findById(categoryId)
            .populate({
                path: "courses",
                select: "courseName price thumbnail studentsEnrolled",
            });

        // Check if category exists
        if (!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        // Get courses from different categories
        const differentCategories = await Category.find({
            _id: { $ne: categoryId },
        }).populate({
            path: "courses",
            select: "courseName price thumbnail studentsEnrolled",
        });

        // Get top 10 selling courses on basis of total students enrolled in particular course
        const topSellingCourses = await Course.aggregate([
            // stage 1 : Iska kaam hai har course ke andar ek temporary field totalStudents add karna
            {
                $addFields: {
                    totalStudents: {
                        $size: {                                    // "$size": Array ki length/count nikalta hai.
                            $ifNull: ["$studentsEnrolled", []],     // Agar studentsEnrolled available hai → use karo.    Agar null/missing hai → empty array [] use karo. 
                        },
                    },
                },
            },
            {
                $sort: {
                    totalStudents: -1,
                },
            },
            {
                $limit: 10,       // Sorting ke baad sirf pehle 10 documents do.
            },
        ]);

        // Return response
        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategories,
                topSellingCourses,
            },
        });

    } catch (error) {
        console.error("Error fetching category page details:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch category page details",
        });
    }
};

