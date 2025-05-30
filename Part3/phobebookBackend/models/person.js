const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose.connect(url)
    .then(result => {
        console.log("connected to MongoDB");
    })
    .catch(error => {
        console.log("error connecting to MongoDB:", error.message);
    })
;

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    phoneNumber: {
        type: String,
        minLenght: 8,
        validate:{
            validator: function(v){
                return /\d{2}-\d{7}/.test(v);
            },
            validator: function(v){
                return /\d{3}-\d{8}/.test(v);
            }
        }
    },
});

personSchema.set("toJSON",{
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model("Person", personSchema);