import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";

export const test = (req, res) => {
  res.json({ message: `API is working!` });
};

// Update User Profile Controller
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }

  if (!req.body.username) {
    return next(errorHandler(400, "Full name is required."));
  }

  if (!req.body.headline) {
    return next(errorHandler(400, "Headline is required."));
  }

  if (req.body.headline) {
    if (req.body.headline.length > 150) {
      return next(errorHandler(400, "headline must not exceed 150 characters"));
    }
  }

  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        errorHandler(400, "Full name must be between 7 and 20 characters")
      );
    }
    // if (req.body.username.includes(" ")) {
    //   return next(errorHandler(400, "Username cannot contain spaces"));
    // }
    // if (req.body.username !== req.body.username.toLowerCase()) {
    //   return next(errorHandler(400, "Username must be lowercase"));
    // }

    if (!req.body.username.match(/^[a-zA-Z\s]+$/)) {
      return next(
        errorHandler(400, "Full Name can only contain letters and spaces")
      );
    }
  }
  if (req.body.bio) {
    if (req.body.bio.length > 250) {
      return next(errorHandler(400, "Bio must not exceed 250 characters"));
    }
  }

  if (req.body.interests) {
    if (req.body.interests.length > 150) {
      return next(
        errorHandler(400, "Interests must not exceed 150 characters")
      );
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          headline: req.body.headline,
          bio: req.body.bio,
          interests: req.body.interests,
        },
      },
      { new: true }
    );
    const { ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Delete User Controller
// export const deleteUser = async (req, res, next) => {
//   if (req.user.id !== req.params.userId) {
//     return next(
//       errorHandler(403, "You  are not allowed to delete the account")
//     );
//   }

//   try {
//     await User.findByIdAndDelete(req.params.userId);
//     res.status(200).json("User has been deleted.");
//   } catch (error) {
//     next(error);
//   }
// };

import bcrypt from "bcryptjs";

export const deleteUser = async (req, res, next) => {
  const { userId } = req.params;
  const { password } = req.body;

  // Ensure only the user can delete their account
  if (req.user.id !== userId) {
    return next(
      errorHandler(403, "You are not allowed to delete this account.")
    );
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, "User not found."));
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(errorHandler(401, "Incorrect password."));
    }

    // Delete all posts by the user
    await Post.deleteMany({ userId });

    // Delete all comments and replies by the user
    await Comment.updateMany(
      { "replies.userId": userId }, // Find comments where the user made replies
      { $pull: { replies: { userId } } } // Remove those replies
    );
    await Comment.deleteMany({ userId }); // Delete all comments directly by the user

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json("User and associated data have been deleted.");
  } catch (error) {
    next(error);
  }
};

// Logout Controller
export const logout = async (req, res, next) => {
  try {
    res.clearCookie("access_token").status(200).json("User has been loged out");
  } catch (error) {
    next(error);
  }
};

// Get all Authors Controller (get all users specifically for the admin)
export const getUsers = async (req, res, next) => {
  // if (!req.user.isAdmin) {
  //   return next(errorHandler(403, "You are not able to see all Authors"));
  // }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Author
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
