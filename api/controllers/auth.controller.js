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

    const verificationURL = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/verify-email/${verificationToken}`;

    // For Real Emails.....
    // const transporter = nodemailer.createTransport({
    //   service: "Gmail",
    //   auth: {
    //     user: process.env.EMAIL_USERNAME,
    //     pass: process.env.EMAIL_PASSWORD,
    //   },
    // });

    // For dummy Emails
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "cb3bc6db42ecfe",
        pass: "80693c921f6dc0",
      },
    });

    // ${process.env.EMAIL_USERNAME}  place in <> for live emails

    await transporter.sendMail({
      from: `"MindStream" <mindstream@gmail.com>`,
      to: email,
      subject: "Verify Your Email",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification - MindStream</title>
    <style>
        /* Basic reset for the page */
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f9;
        }

        /* Container for the email body */
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 30px;
            background-color: #fff;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            text-align: center;
        }

        /* MindStream branding style */
        .mindstream-branding {
            font-size: 36px;
            font-weight: bold;
            background: linear-gradient(to right, #6A1B9A, #9C27B0);
            -webkit-background-clip: text;
            color: transparent;
            margin-bottom: 20px;
        }

        /* Header style */
        .email-container h1 {
            color: #fff;
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 20px;
            background: linear-gradient(to right, #6A1B9A, #9C27B0);
            -webkit-background-clip: text;
            color: transparent;
        }

        /* Paragraph style */
        .email-container p {
            font-size: 16px;
            color: #555;
            line-height: 1.5;
            margin-bottom: 20px;
        }

        /* Styled verification link */
        .verification-link {
            display: block;
            background-color: #6A1B9A; /* Purple theme */
            color: #fff;
            padding: 12px 24px;
            font-size: 16px;
            text-decoration: none;
            border-radius: 4px;
            transition: background-color 0.3s ease;
            margin: 0 auto 20px;
            max-width: 200px;
        }

        /* Hover effect for the link */
        .verification-link:hover {
            background-color: #8E24AA; /* Slightly lighter purple for hover effect */
        }

        /* Mindstream effect - subtle animation to focus attention */
        .verification-link::before {
            content: '';
            display: block;
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            transform: scale(0);
            animation: mindstream 1.5s ease-out infinite;
            animation-delay: 0.3s;
        }

        @keyframes mindstream {
            0% {
                transform: scale(0);
                opacity: 0.5;
            }
            100% {
                transform: scale(3);
                opacity: 0;
            }
        }

        /* Additional section for further instructions or information */
        .additional-info {
            font-size: 14px;
            color: #777;
            margin-top: 30px;
            text-align: left;
            padding: 0 20px;
        }

        .additional-info p {
            margin-bottom: 10px;
        }

        /* Responsive design for smaller screens */
        @media (max-width: 600px) {
            .email-container {
                padding: 20px;
            }

            .email-container h1 {
                font-size: 28px;
            }

            .email-container p {
                font-size: 14px;
            }

            .verification-link {
                padding: 10px 20px;
            }
        }

        /* Full-page background gradient */
        .bg-gradient {
            background: linear-gradient(to right, #6A1B9A, #9C27B0);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    </style>
</head>
<body>
    <div class="bg-gradient">
        <div class="email-container">
            <!-- MindStream Branding -->
            <div class="mindstream-branding">MindStream</div>

            <h1>Email Verification</h1>
            
            <!-- Email Content -->
            <p>Hi there!</p>
            <p>Thank you for registering with MindStream. To complete your account setup, please verify your email address by clicking the link below:</p>

            <!-- Centered Verification Link -->
            <a href="${verificationURL}" class="verification-link">Verify Email</a>

            <p>If you did not request this verification, you can ignore this message. The link will expire in 24 hours, so make sure to verify your email soon!</p>

            <!-- Additional Info Section -->
            <div class="additional-info">
                <p>If you encounter any issues, feel free to contact our support team at <strong>support@mindstream.com</strong>.</p>
                <p>Best regards,</p>
                <p><strong>The MindStream Team</strong></p>
            </div>
        </div>
    </div>
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
export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
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
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
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
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/reset-password/${encodeURIComponent(resetToken)}`;

    // const transporter = nodemailer.createTransport({
    //   service: "Gmail",
    //   auth: {
    //     user: process.env.EMAIL_USERNAME,
    //     pass: process.env.EMAIL_PASSWORD,
    //   },
    // });

    // For dummy Emails
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "cb3bc6db42ecfe",
        pass: "80693c921f6dc0",
      },
    });

    // ${process.env.EMAIL_USERNAME}  place in <> for live emails

    await transporter.sendMail({
      from: `"MindStream" <mindstream@gmail.com>`,
      to: user.email,
      subject: "Password Reset Request",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - MindStream</title>
    <style>
        /* Basic reset for the page */
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f9;
        }

        /* Container for the email body */
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 30px;
            background-color: #fff;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            text-align: center;
        }

        /* MindStream branding style */
        .mindstream-branding {
            font-size: 36px;
            font-weight: bold;
            background: linear-gradient(to right, #6A1B9A, #9C27B0);
            -webkit-background-clip: text;
            color: transparent;
            margin-bottom: 20px;
        }

        /* Header style */
        .email-container h1 {
            color: #fff;
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 20px;
            background: linear-gradient(to right, #6A1B9A, #9C27B0);
            -webkit-background-clip: text;
            color: transparent;
        }

        /* Paragraph style */
        .email-container p {
            font-size: 16px;
            color: #555;
            line-height: 1.5;
            margin-bottom: 20px;
        }

        /* Styled reset link */
        .reset-link {
            display: block;
            background-color: #6A1B9A; /* Purple theme */
            color: #fff;
            padding: 12px 24px;
            font-size: 16px;
            text-decoration: none;
            border-radius: 4px;
            transition: background-color 0.3s ease;
            margin: 0 auto 20px;
            max-width: 200px;
        }

        /* Hover effect for the link */
        .reset-link:hover {
            background-color: #8E24AA; /* Slightly lighter purple for hover effect */
        }

        /* Mindstream effect - subtle animation to focus attention */
        .reset-link::before {
            content: '';
            display: block;
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            transform: scale(0);
            animation: mindstream 1.5s ease-out infinite;
            animation-delay: 0.3s;
        }

        @keyframes mindstream {
            0% {
                transform: scale(0);
                opacity: 0.5;
            }
            100% {
                transform: scale(3);
                opacity: 0;
            }
        }

        /* Responsive design for smaller screens */
        @media (max-width: 600px) {
            .email-container {
                padding: 20px;
            }

            .email-container h1 {
                font-size: 28px;
            }

            .email-container p {
                font-size: 14px;
            }

            .reset-link {
                padding: 10px 20px;
            }
        }

        /* Full-page background gradient */
        .bg-gradient {
            background: linear-gradient(to right, #6A1B9A, #9C27B0);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    </style>
</head>
<body>
    <div class="bg-gradient">
        <div class="email-container">
            <!-- MindStream Branding -->
            <div class="mindstream-branding">MindStream</div>

            <h1>Password Reset Request</h1>
            <p>You requested a password reset for your MindStream account. Click the link below to reset your password:</p>

            <!-- Reset Link -->
            <a href="${resetURL}" class="reset-link">Reset Password</a>

            <p>If you did not request this, please ignore this email. Your password will remain unchanged.</p>
        </div>
    </div>
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

// Verify Email
export const verifyEmail = async (req, res, next) => {
  const { token } = req.params;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token." });
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Email verified successfully!" });
  } catch (error) {
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
