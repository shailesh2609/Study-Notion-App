const mongoose = require("mongoose");

require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("DB Connection Successful")
    })
    .catch((error) => {
        console.log("DB Connection Un-Successful");
        console.log(Error);
        process.exit(1);
    })
}