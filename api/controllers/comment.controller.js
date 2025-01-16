import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    if (userId !== req.user.id) {
      return next(
        errorHandler(403, "You are not allowed to create this comment")
      );
    }

    if (!content || content.trim() === "") {
      return next(errorHandler(400, "Empty comment cannot be added."));
    }

    if (content.length > 200) {
      return next(errorHandler(400, "Comment cannot exceed 200 characters"));
    }

    const newComment = new Comment({
      content,
      postId,
      userId,
    });
    await newComment.save();

    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to edit this comment")
      );
    }

    if (!req.body.content || req.body.content.trim() === "") {
      return next(errorHandler(400, "Empty comment cannot be added."));
    }

    if (req.body.content.length > 200) {
      return next(errorHandler(400, "Comment cannot exceed 200 characters"));
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      { new: true }
    );
    res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to delete this comment")
      );
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json("Comment has been deleted");
  } catch (error) {
    next(error);
  }
};

export const getcomments = async (req, res, next) => {
  if (!req.user.isAdmin)
    return next(errorHandler(403, "You are not allowed to get all comments"));
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;
    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (error) {
    next(error);
  }
};

//  Reply controllers
export const createReply = async (req, res, next) => {
  try {
    const { content, commentId } = req.body;

    if (!content || content.trim() === "") {
      return next(errorHandler(400, "Reply content cannot be empty"));
    }

    if (content.length > 200) {
      return next(
        errorHandler(400, "Reply content cannot exceed 200 characters")
      );
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }

    const newReply = { content, userId: req.user.id };
    comment.replies.push(newReply);

    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

export const likeReply = async (req, res, next) => {
  try {
    const comment = await Comment.findOne({
      _id: req.params.commentId,
      "replies._id": req.params.replyId,
    });

    if (!comment) {
      return next(errorHandler(404, "Comment or reply not found"));
    }

    const reply = comment.replies.id(req.params.replyId);
    const userIndex = reply.likes.indexOf(req.user.id);

    if (userIndex === -1) {
      reply.numberOfLikes += 1;
      reply.likes.push(req.user.id);
    } else {
      reply.numberOfLikes -= 1;
      reply.likes.splice(userIndex, 1);
    }

    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const editReply = async (req, res, next) => {
  try {
    const comment = await Comment.findOne({
      _id: req.params.commentId,
      "replies._id": req.params.replyId,
    });

    if (!comment) {
      return next(errorHandler(404, "Comment or reply not found"));
    }

    const reply = comment.replies.id(req.params.replyId);

    if (reply.userId !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(403, "You are not allowed to edit this reply"));
    }

    reply.content = req.body.content;

    if (!reply.content || reply.content.trim() === "") {
      return next(errorHandler(400, "Reply content cannot be empty"));
    }

    if (reply.content.length > 200) {
      return next(
        errorHandler(400, "Reply content cannot exceed 200 characters")
      );
    }

    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const deleteReply = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }

    const replyIndex = comment.replies.findIndex(
      (reply) => reply._id.toString() === req.params.replyId
    );

    if (replyIndex === -1) {
      return next(errorHandler(404, "Reply not found"));
    }

    if (
      comment.replies[replyIndex].userId !== req.user.id &&
      !req.user.isAdmin
    ) {
      return next(
        errorHandler(403, "You are not allowed to delete this reply")
      );
    }

    comment.replies.splice(replyIndex, 1);
    await comment.save();

    res.status(200).json("Reply has been deleted");
  } catch (error) {
    next(error);
  }
};
