const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const crypto = require("crypto");


//capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
    //get courseId and UserID
    const {course_id} = req.body;
    const userId = req.user.id;
    //validation
    //valid courseID
    if(!course_id) {
        return res.json({
            success:false,
            message:'Please provide valid course ID',
        })
    };
    //valid courseDetail
    let course;
    try{
        course = await Course.findById(course_id);
        if(!course) {
            return res.json({
                success:false,
                message:'Could not find the course',
            });
        }

        //user already pay for the same course
        const uid = new mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uid)) {
            return res.status(200).json({
                success:false,
                message:'Student is already enrolled',
            });
        }
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
    
    //order create
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount: amount * 100,
        currency,
        receipt: `receipt_${Date.now()}`,
        notes:{
            courseId: course_id,
            userId,
        }
    };

    try{
        //initiate the payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);
        //return response
        return res.status(200).json({
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount,
        });
    }
    catch(error) {
        console.log(error);
        res.json({
            success:false,
            message:"Could not initiate order",
        });
    }
    

};



//verify Signature of Razorpay and Server
exports.verifySignature = async (req, res) => {
    // example webhook secret key 
    const webhookSecret = "12345678";

    // From razorpay 
    const receivedSignature = req.headers["x-razorpay-signature"];
    
    if (!receivedSignature) {
      return res.status(400).json({
        error: "Missing signature ",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(req.body))
      .digest("hex");


    if(receivedSignature === expectedSignature) {
        console.log("Payment is Authorised");


        // JSON request body looks like 
        // {
        //   "entity": "event",
        //   "event": "payment.captured",
        //   "payload": {
        //     "payment": {
        //       "entity": {
        //         "id": "pay_example123",
        //         "order_id": "order_example123",
        //         "amount": 50000,
        //         "status": "captured",
        //         "notes": {
        //           "userId": "123",
        //           "productId": "456"
        //         }
        //       }
        //     }
        //   }
        // }
        const {courseId, userId} = req.body.payload.payment.entity.notes;

        try{
                //fulfil the action

                //find the course and enroll the student in it
                const enrolledCourse = await Course.findOneAndUpdate(
                                                {_id: courseId},
                                                {$addToSet:{studentsEnrolled:userId}},
                                                {new:true},
                );

                if(!enrolledCourse) {
                    return res.status(500).json({
                        success:false,
                        message:'Course not Found',
                    });
                }

                console.log(enrolledCourse);

                //find the student andadd the course to their list enrolled courses me 
                const enrolledStudent = await User.findOneAndUpdate(
                                                {_id:userId},
                                                {$addToSet:{courses:courseId}},
                                                {new:true},
                );

                console.log(enrolledStudent);

                //mail send krdo confirmation wala 
                const emailResponse = await mailSender(
                                        enrolledStudent.email,
                                        "Congratulations from CodeHelp",
                                        "Congratulations, you are onboarded into new CodeHelp Course",
                );

                console.log(emailResponse);
                return res.status(200).json({
                    success:true,
                    message:"Signature Verified and COurse Added",
                });


        }       
        catch(error) {
            console.log(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            });
        }
    }
    else {
        return res.status(400).json({
            success:false,
            message:'Invalid request',
        });
    }


};