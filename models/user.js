const { required } = require("joi");
const mongoose= require("mongoose");
const schema= mongoose.Schema;
const passportLocalMongoose= require("passport-local-mongoose");

const userschema= new schema({
    email:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    }
});

userschema.plugin(passportLocalMongoose);
module.exports=mongoose.model("user",userschema);