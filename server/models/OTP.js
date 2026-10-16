const mongoose  = require("mongoose");
const otpTemplate = require("../mail/templates/emailVerificationTemplate");
const mailSender = require("../utils/mailSender");


const otpSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    otp:{
        type: String,
        required:true,
    },
    createdAt:{
        type:Date,
        default: Date.now,
        expires: 5*60    // 5 minutes
    }
    
});



// a function -> to send emails
async function sendVerificationEmail(email, otp){
    try{
        const mailResponse = await mailSender(email, "Verification Email From Study Notion",  otpTemplate(otp));
        console.log("Email sent Successfully : ", mailResponse);
    }
    catch(error){
        console.log("Error occurred while sending mail", error);
        throw error;
    }
}

// pre middleware used -> before creating entry in db
otpSchema.pre('save', async function(){
    await sendVerificationEmail(this.email, this.otp);
})

module.exports = mongoose.model("OTP", otpSchema);