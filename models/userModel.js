const mongoose= require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type : String,
        required:[true,'Username is Required'],
    },
    email:{
        type:String ,
        unique: true,
        required:[true,'Email is required']

    },
    password:{
        type:String ,  
        minlength: 6,
        maxlength:1024,
        required:[true,'Passeword is required']
    },
    blogs: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Blog",
      },
    ],
},
{timestamps:true}
);

const userModel= mongoose.model("User",userSchema);

module.exports= userModel;
