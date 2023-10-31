import * as argon2 from "argon2";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const {sign} = jwt;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg",
    },
    role: {
      type: String,
      default: "USER",
    },
    activationStatus: {
      type: Boolean,
      default: false,
    },
    activationToken: {
      activationOTP: String,
      timeCreated: Date,
      expirationTime: Date,
    },
    mfaToken: {
      mfaOTP: String,
      timeCreated: Date,
      expirationTime: Date,
    },
    refreshToken: [String],
    resetToken: String,
  },
  { timestamps: true }
);

// Hash password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    
    this.password = await argon2.hash(this.password,10);
});

userSchema.methods.getJwtAccessToken = function (secret, expirationTime) {
  return sign({ id: this._id, role: this.role }, secret, {
    expiresIn: expirationTime,
  });
};


userSchema.methods.comparePassword = async function (enteredPassword) {
  return await argon2.verify(this.password, enteredPassword);
};

const User = mongoose.model('User', userSchema);

export default User;



