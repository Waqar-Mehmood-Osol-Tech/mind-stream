import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createComment,
  deleteComment,
  editComment,
  getPostComments,
  getcomments,
  likeComment,
  createReply,
  likeReply,
  editReply,
  deleteReply,
} from "../controllers/comment.controller.js";

const router = express.Router();

// Comments Routes
router.post("/create", verifyToken, createComment);
router.get("/getPostComments/:postId", getPostComments);
router.put("/likeComment/:commentId", verifyToken, likeComment);
router.put("/editComment/:commentId", verifyToken, editComment);
router.delete("/deleteComment/:commentId", verifyToken, deleteComment);
router.get("/getcomments", verifyToken, getcomments);

// Reply routes
router.post("/createReply", verifyToken, createReply);
router.put("/likeReply/:commentId/:replyId", verifyToken, likeReply);
router.put("/editReply/:commentId/:replyId", verifyToken, editReply);
router.delete("/deleteReply/:commentId/:replyId", verifyToken, deleteReply);

export default router;
