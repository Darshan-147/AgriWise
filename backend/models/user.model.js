import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import ApiError from "../Utils/ApiError.js";

const userSchema = new mongoose.Schema(
  {
    profilePic: {
      type: String,
      default:
        "https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/profile-pic-male_4811a1.svg",
    },
    username: {
      type: String,
      required: [true, "Please enter your name."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email."],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please enter a valid email."],
    },
    password: {
      type: String,
      required: [true, "Please enter a password."],
      minlength: 8,
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "Please confirm your password."],
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: "Password and confirm password do not match.",
      },
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      index: true,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    notVerified: {
      type: Boolean,
      default: true,
      select: false,
    },
    changeEmailVerificationOtp: String,
    changeEmailVerificationOtpExpires: Date,
    otp: String,
    otpExpires: Date,
    PasswordChangedAt: Date,
    PasswordResetToken: String,
    PasswordResetTokenExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
  } catch (error) {
    next(new ApiError(500, error.message));
  }
});

userSchema.methods.checkPassword = async function (password, passwordFromDb) {
  return bcrypt.compare(password, passwordFromDb);
};

userSchema.methods.isPasswordChanged = function (jwtIssuedAt) {
  if (this.PasswordChangedAt) {
    const passwordChangedTimestamp = parseInt(this.PasswordChangedAt.getTime() / 1000, 10);
    return jwtIssuedAt < passwordChangedTimestamp;
  }

  return false;
};

userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.PasswordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.PasswordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.methods.generateOtp = async function () {
  const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
  this.otp = crypto.createHash("sha256").update(otp).digest("hex");
  this.otpExpires = Date.now() + 10 * 60 * 1000;
  return otp;
};

userSchema.methods.generateOtpForChangingEmail = async function () {
  const changeEmailVerificationOtp = `${Math.floor(100000 + Math.random() * 900000)}`;
  this.changeEmailVerificationOtp = crypto
    .createHash("sha256")
    .update(changeEmailVerificationOtp)
    .digest("hex");
  this.changeEmailVerificationOtpExpires = Date.now() + 10 * 60 * 1000;
  return changeEmailVerificationOtp;
};

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

const userModel = mongoose.model("userModel", userSchema);

export default userModel;
