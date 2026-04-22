import express from "express";
import * as authController from "../controllers/auth2.controller.js";
import protect from "../Middleware/protect.middleware.js";
import upload from "../Middleware/multer.middleware.js";

const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/logout").post(authController.logout);
router.route("/forgotPassword").post(authController.forgotPassword);
router.route("/getotp").post(authController.getVarified);
router.route("/verifyotp").post(authController.verifyOtp);
router.route("/change-role").patch(protect, authController.changeRole);
router.route("/get-email-change-otp").post(protect, authController.changeEmailVerificationOtpReq);
router.route("/verify-email-change-otp").post(protect, authController.changeEmailVerifyOtp);
router.route("/resetPassword/:token").patch(authController.resetPassword);
router.route("/deleteMe").delete(protect, authController.deleteMe);
router.route("/getCurrentUser").get(protect, authController.getCurrentUser);
router.route("/updateUser").put(protect, upload.single('mainImage'), authController.updateProfile);

export default router;
