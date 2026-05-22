import asyncHandler from "./asyncHandler.js";
import nodemailer from "nodemailer";
import emailConfig from "../Config/env.js";

const sendEmail = asyncHandler(async (options) => {
  if (
    !emailConfig.EMAIL ||
    !emailConfig.PASSWORD ||
    emailConfig.PASSWORD === "your_app_specific_password"
  ) {
    throw new Error("Email credentials are not configured.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailConfig.EMAIL,
      pass: emailConfig.PASSWORD,
    },
  });

  const emailOption = {
    from: emailConfig.EMAIL,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  await transporter.sendMail(emailOption);
});

export default sendEmail;
