import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Sign-Up  Controller
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(errorHandler(400, "All fields are required"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    emailVerificationToken: hashedToken,
    emailVerificationExpires: Date.now() + 30 * 60 * 1000, // 30 minutes
  });

  try {
    await newUser.save();

    const verificationURL = `${process.env.FRONT_END_URL}/verify-email/${verificationToken}`;

    // For Real Emails.....
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // For dummy Emails
    // const transporter = nodemailer.createTransport({
    //   host: "sandbox.smtp.mailtrap.io",
    //   port: 2525,
    //   auth: {
    //     user: "cb3bc6db42ecfe",
    //     pass: "80693c921f6dc0",
    //   },
    // });

    // ${process.env.EMAIL_USERNAME}  place in <> for live emails

    await transporter.sendMail({
      from: `"MindStream" <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: "Verify Your Email",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification - MindStream</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #6A1B9A;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #6A1B9A;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <!-- Main Content Table -->
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td style="padding: 40px 30px; text-align: center;">
                            <!-- Logo/Brand -->
                            <h1 style="font-size: 36px; margin: 0 0 20px 0; color: #6A1B9A;">MindStream</h1>
                            
                            <!-- Title -->
                            <h2 style="font-size: 28px; margin: 0 0 30px 0; color: #6A1B9A;">Email Verification</h2>
                            
                            <!-- Content -->
                            <p style="font-size: 16px; line-height: 1.5; color: #555; margin: 0 0 20px 0;">Hi there!</p>
                            
                            <p style="font-size: 16px; line-height: 1.5; color: #555; margin: 0 0 30px 0;">
                                Thank you for registering with MindStream. To complete your account setup, please verify your email address by clicking the button below:
                            </p>
                            
                            <!-- Button -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <table cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td align="center" style="background-color: #6A1B9A; border-radius: 4px;">
                                                    <a href="${verificationURL}" style="display: inline-block; padding: 12px 24px; font-size: 16px; color: #ffffff; text-decoration: none;">Verify Email</a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="font-size: 16px; line-height: 1.5; color: #555; margin: 0 0 30px 0;">
                                If you did not request this verification, you can ignore this message. The link will expire in 24 hours, so make sure to verify your email soon!
                            </p>
                            
                            <!-- Additional Info -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #eee;">
                                <tr>
                                    <td style="padding: 20px 0 0 0;">
                                        <p style="font-size: 14px; line-height: 1.5; color: #777; margin: 0 0 10px 0;">
                                            If you encounter any issues, feel free to contact our support team at
                                            <a href="mailto:support@mindstream.com" style="color: #6A1B9A; text-decoration: none;">support@mindstream.com</a>
                                        </p>
                                        <p style="font-size: 14px; line-height: 1.5; color: #777; margin: 0 0 5px 0;">Best regards,</p>
                                        <p style="font-size: 14px; line-height: 1.5; color: #777; margin: 0; font-weight: bold;">The MindStream Team</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`,
    });

    res.status(200).json("Signup successful! Please verify your email.");
  } catch (error) {
    if (error.code === 11000) {
      return next(errorHandler(400, "Email already exists"));
    }
    next(error);
  }
};

// Sign-In Controller
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email.trim() === "" || password.trim() === "") {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    if (!validUser.isVerified) {
      return next(
        errorHandler(403, "Please verify your email before signing in.")
      );
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(404, "Invalid password"));
    }

    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET
    );
    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json({ ...rest, token });
  } catch (error) {
    next(error);
  }
};

// google auth controller
// export const google = async (req, res, next) => {
//   const { email, name, googlePhotoUrl } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (user) {
//       const token = jwt.sign(
//         { id: user._id, isAdmin: user.isAdmin },
//         process.env.JWT_SECRET
//       );
//       const { password, ...rest } = user._doc;
//       res
//         .status(200)
//         .cookie("access_token", token, {
//           httpOnly: true,
//         })
//         .json(rest);
//     } else {
//       const generatedPassword =
//         Math.random().toString(36).slice(-8) +
//         Math.random().toString(36).slice(-8);
//       const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
//       const newUser = new User({
//         username:
//           name.toLowerCase().split(" ").join("") +
//           Math.random().toString(9).slice(-4),
//         email,
//         password: hashedPassword,
//         profilePicture: googlePhotoUrl,
//       });
//       await newUser.save();
//       const token = jwt.sign(
//         { id: newUser._id, isAdmin: newUser.isAdmin },
//         process.env.JWT_SECRET
//       );
//       const { password, ...rest } = newUser._doc;
//       res
//         .status(200)
//         .cookie("access_token", token, {
//           httpOnly: true,
//         })
//         .json(rest);
//     }
//   } catch (error) {
//     next(error);
//   }
// };

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      if (!user.isVerified) {
        return next(errorHandler(403, "Please verify your email to continue."));
      }
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex");

      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
        emailVerificationToken: hashedToken,
        emailVerificationExpires: Date.now() + 30 * 60 * 1000, // 30 minutes
      });
      await newUser.save();

      const verificationURL = `${process.env.FRONT_END_URL}/verify-email/${verificationToken}`;

      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: `"MindStream" <${process.env.EMAIL_USERNAME}>`,
        to: email,
        subject: "Verify Your Email",
        html: `<p>Hi ${name},</p>
              <p>Thanks for signing up using Google! Please verify your email by clicking the link below:</p>
              <a href="${verificationURL}">Verify Email</a>
              <p>This link will expire in 30 minutes.</p>`,
      });

      res.status(200).json({
        message:
          "Account created successfully! Please verify your email to continue.",
      });
    }
  } catch (error) {
    next(error);
  }
};

// Forgot Password
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  if (!email || email.trim() === "") {
    return next(errorHandler(400, "Email is required"));
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, "No account found with this email"));
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save token and expiration in the user's record
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 40 * 60 * 1000; // 40 minutes
    await user.save();

    // console.log("Generated Reset Token (Raw):", resetToken);
    // console.log("Generated Reset Token (Hashed):", hashedToken);

    // Send email
    const resetURL = `${
      process.env.FRONT_END_URL
    }/reset-password/${encodeURIComponent(resetToken)}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // For dummy Emails
    // const transporter = nodemailer.createTransport({
    //   host: "sandbox.smtp.mailtrap.io",
    //   port: 2525,
    //   auth: {
    //     user: "cb3bc6db42ecfe",
    //     pass: "80693c921f6dc0",
    //   },
    // });

    // ${process.env.EMAIL_USERNAME}  place in <> for live emails

    await transporter.sendMail({
      from: `"MindStream" <${process.env.EMAIL_USERNAME}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - MindStream</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #6A1B9A;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #6A1B9A;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <!-- Main Content Table -->
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td style="padding: 40px 30px; text-align: center;">
                            <!-- Logo/Brand -->
                            <h1 style="font-size: 36px; margin: 0 0 20px 0; color: #6A1B9A;">MindStream</h1>
                            
                            <!-- Title -->
                            <h2 style="font-size: 28px; margin: 0 0 30px 0; color: #6A1B9A;">Password Reset Request</h2>
                            
                            <!-- Content -->
                            <p style="font-size: 16px; line-height: 1.5; color: #555; margin: 0 0 30px 0;">
                                You requested a password reset for your MindStream account. Click the button below to reset your password:
                            </p>
                            
                            <!-- Button -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <table cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td align="center" style="background-color: #6A1B9A; border-radius: 4px;">
                                                    <a href="${resetURL}" style="display: inline-block; padding: 12px 24px; font-size: 16px; color: #ffffff; text-decoration: none;">Reset Password</a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="font-size: 16px; line-height: 1.5; color: #555; margin: 0 0 20px 0;">
                                If you did not request this, please ignore this email. Your password will remain unchanged.
                            </p>
                            
                            <!-- Footer -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #eee;">
                                <tr>
                                    <td style="padding: 20px 0 0 0;">
                                        <p style="font-size: 14px; line-height: 1.5; color: #777; margin: 0;">
                                            For security reasons, this password reset link will expire in 24 hours.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html> `,
    });

    res.status(200).json("Password reset link sent!");
  } catch (error) {
    next(error);
  }
};

// Reset Password
export const resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  if (!newPassword || !confirmPassword || newPassword !== confirmPassword) {
    return next(errorHandler(400, "Passwords do not match"));
  }

  try {
    const decodedToken = decodeURIComponent(token);
    const hashedToken = crypto
      .createHash("sha256")
      .update(decodedToken)
      .digest("hex");

    // console.log("Received Token (Raw):", token);
    // console.log("Hashed Token for Validation:", hashedToken);

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    // console.log("User Found for Token Validation:", user);

    if (!user) {
      return next(errorHandler(400, "Invalid or expired token"));
    }

    user.password = bcryptjs.hashSync(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json("Password reset successful!");
  } catch (error) {
    console.error("Error in Reset Password:", error);
    next(error);
  }
};

// // Verify Email
// export const verifyEmail = async (req, res, next) => {
//   const { token } = req.params;

//   try {
//     const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
//     const user = await User.findOne({
//       emailVerificationToken: hashedToken,
//       emailVerificationExpires: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid or expired token." });
//     }

//     user.isVerified = true;
//     user.emailVerificationToken = undefined;
//     user.emailVerificationExpires = undefined;
//     await user.save();

//     res
//       .status(200)
//       .json({ success: true, message: "Email verified successfully!" });
//   } catch (error) {
//     next(error);
//   }
// };

export const verifyEmail = async (req, res, next) => {
  const { token } = req.params;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
   
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Email verified successfully!" });
  } catch (error) {
    console.error("Error in email verification:", error);
    next(error);
  }
};

// Update Password
export const updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return next(errorHandler(400, "All fields are required"));
  }

  if (newPassword !== confirmPassword) {
    return next(errorHandler(400, "New passwords do not match"));
  }

  // Validate password strength
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    return next(
      errorHandler(
        400,
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character"
      )
    );
  }

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    const isMatch = bcryptjs.compareSync(currentPassword, user.password);
    if (!isMatch) {
      return next(errorHandler(400, "Current password is incorrect"));
    }

    user.password = bcryptjs.hashSync(newPassword, 10);
    await user.save();

    res.status(200).json("Password updated successfully!");
  } catch (error) {
    next(error);
  }
};
