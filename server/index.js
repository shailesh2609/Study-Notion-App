const express= require("express");
const app = express();

require('./utils/nodeCron');

const userRoutes = require('./routes/userRoute')
const paymentRoutes = require('./routes/paymentRoute')
const courseRoutes = require('./routes/courseRoute')
const profileRoutes = require('./routes/profileRoute')

const database = require('./config/database');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect} = require('./config/cloudinary');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');

dotenv.config(); 
const PORT = process.env.PORT || 4000;


// database connect
database.connect();

// middlewares   (app.use() ka use middleware ko register karne ke liye hota hai.)
app.use(express.json());    // Jab frontend JSON data backend ko bhejta hai, toh express.json() us data ko parse karta hai, taaki hum req.body se access kar sakein.
app.use(cookieParser());
app.use(
    cors({
        origin : "http://localhost:3000",
        credentials:true
    })
)
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

// cloudinary connection
cloudinaryConnect();


// routes mounting
app.use("/api/v1/auth", userRoutes);             // Iska matlab hai ki /api/v1/auth se shuru hone wali requests courseRoutes ko bheji jayengi.
app.use("/api/v1/profile", profileRoutes); 
app.use("/api/v1/payment", paymentRoutes); 
app.use("/api/v1/course", courseRoutes); 


// default route
app.get("/", (req,res) => {
    return res.status(200).json({
        success : true,
        message: "Your Server is Up and Running"
    })
});

app.listen(PORT, () => {
    console.log(`App is Running Successfully at ${PORT} `)
})