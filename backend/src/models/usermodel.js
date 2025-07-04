import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,"Username required"],
        trim: true
    },
    college: {
        type: String,
        trim: true
    },
    branch: {
        type: String,
        trim: true
    },
    course: {
        type: String,
        trim: true
    },
    studyYear: {
        type: Number,
        trim: true
    },
    email: {
        type: String,
        required: [true,"E-mail required"],
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    password: {
        type: String,
        select: false
    },
    googleId : {
        type: String,
        select: false
    },
    refreshToken: {
        type: String
    },
    status: {
        type: String,
        enum: ['ready', 'busy'],
        default: 'ready'
    },
    profile_pic : {
        type : String,
        default : ""
    },
    connections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    blockedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
    }]
      
},
{timestamps: true});

userSchema.pre("save", async function (next) {
    if(this.isModified("password")){
        this.password = await bcryptjs.hash(this.password,5);
    }
    next();
});

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcryptjs.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
}

export const UserModel = mongoose.model("User",userSchema);