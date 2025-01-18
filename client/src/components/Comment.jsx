/* eslint-disable react/prop-types */
// import { useState, useEffect } from "react";
// import moment from "moment";
// import { FaThumbsUp, FaReply } from "react-icons/fa";
// import { useSelector } from "react-redux";

// const Reply = ({ reply, onLike, onEdit, onDelete, commentId }) => {
//   const [user, setUser] = useState({});
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedContent, setEditedContent] = useState(reply.content);
//   const { currentUser } = useSelector((state) => state.user);

//   useEffect(() => {
//     const getUser = async () => {
//       try {
//         const res = await fetch(`/api/user/${reply.userId}`);
//         const data = await res.json();
//         if (res.ok) {
//           setUser(data);
//         }
//       } catch (error) {
//         console.log(error.message);
//       }
//     };
//     getUser();
//   }, [reply.userId]);

//   const handleEdit = () => {
//     setIsEditing(true);
//     setEditedContent(reply.content);
//   };

//   const handleSave = async () => {
//     try {
//       const res = await fetch(
//         `/api/comment/editReply/${commentId}/${reply._id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             content: editedContent,
//           }),
//         }
//       );
//       if (res.ok) {
//         setIsEditing(false);
//         onEdit(commentId, reply._id, editedContent);
//       }
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   const canModify = currentUser && currentUser._id === reply.userId;

//   return (
//     <div className="flex p-4 border-t dark:border-gray-600 text-sm ml-8">
//       <div className="flex-shrink-0 mr-3">
//         <img
//           className="w-8 h-8 rounded-full bg-gray-200"
//           src={user.profilePicture}
//           alt={user.username}
//         />
//       </div>
//       <div className="flex-1">
//         <div className="flex items-center mb-1">
//           <span className="font-bold mr-1 text-xs truncate">
//             {user ? `@${user.username}` : "anonymous user"}
//           </span>
//           <span className="text-gray-500 text-xs">
//             {moment(reply.createdAt).fromNow()}
//           </span>
//         </div>
//         {isEditing ? (
//           <>
//             <textarea
//               className="mb-2 w-full rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
//               value={editedContent}
//               onChange={(e) => setEditedContent(e.target.value)}
//             />
//             <div className="flex justify-end gap-2 text-xs">
//               <button
//                 className="bg-purple-700 px-4 py-2 hover:!bg-purple-600 rounded-lg text-white"
//                 onClick={handleSave}
//               >
//                 Save
//               </button>
//               <button
//                 className="bg-red-700 hover:!bg-red-600 px-2 py-2 rounded-lg text-white focus:ring-purple-900"
//                 onClick={() => setIsEditing(false)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </>
//         ) : (
//           <>
//             <p className="text-gray-500 pb-2">{reply.content}</p>
//             <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
//               <button
//                 type="button"
//                 onClick={() => onLike(commentId, reply._id)}
//                 className={`text-gray-400 hover:text-blue-500 ${
//                   currentUser &&
//                   reply.likes.includes(currentUser._id) &&
//                   "!text-blue-500"
//                 }`}
//               >
//                 <FaThumbsUp className="text-sm" />
//               </button>
//               <p className="text-gray-400">
//                 {reply.numberOfLikes > 0 &&
//                   reply.numberOfLikes +
//                     " " +
//                     (reply.numberOfLikes === 1 ? "like" : "likes")}
//               </p>
//               {canModify && (
//                 <>
//                   <button
//                     type="button"
//                     onClick={handleEdit}
//                     className="text-gray-400 hover:text-blue-500"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => onDelete(commentId, reply._id)}
//                     className="text-gray-400 hover:text-red-500"
//                   >
//                     Delete
//                   </button>
//                 </>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default function Comment({
//   comment,
//   onLike,
//   onEdit,
//   onDelete,
//   onReply,
//   onLikeReply,
//   onEditReply,
//   onDeleteReply,
// }) {
//   const [user, setUser] = useState({});
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedContent, setEditedContent] = useState(comment.content);
//   const [isReplying, setIsReplying] = useState(false);
//   const [replyContent, setReplyContent] = useState("");
//   const [replies, setReplies] = useState(comment.replies);
//   const { currentUser } = useSelector((state) => state.user);

//   useEffect(() => {
//     const getUser = async () => {
//       try {
//         const res = await fetch(`/api/user/${comment.userId}`);
//         const data = await res.json();
//         if (res.ok) {
//           setUser(data);
//         }
//       } catch (error) {
//         console.log(error.message);
//       }
//     };
//     getUser();
//   }, [comment.userId]);

//   useEffect(() => {
//     setReplies(comment.replies);
//   }, [comment.replies]);

//   const handleEdit = () => {
//     setIsEditing(true);
//     setEditedContent(comment.content);
//   };

//   const handleSave = async () => {
//     try {
//       const res = await fetch(`/api/comment/editComment/${comment._id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           content: editedContent,
//         }),
//       });
//       if (res.ok) {
//         setIsEditing(false);
//         onEdit(comment, editedContent);
//       }
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   const handleReply = async () => {
//     try {
//       const res = await fetch("/api/comment/createReply", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           content: replyContent,
//           commentId: comment._id,
//           userId: currentUser._id,
//         }),
//       });
//       if (res.ok) {
//         const updatedComment = await res.json();
//         setReplies(updatedComment.replies);
//         setIsReplying(false);
//         setReplyContent("");
//         onReply(comment._id, updatedComment);
//       } else {
//         console.log("Failed to post reply");
//       }
//     } catch (error) {
//       console.error(error.message);
//     }
//   };

//   const handleDeleteReply = async (commentId, replyId) => {
//     try {
//       const res = await fetch(
//         `/api/comment/deleteReply/${commentId}/${replyId}`,
//         {
//           method: "DELETE",
//         }
//       );
//       if (res.ok) {
//         setReplies(replies.filter((reply) => reply._id !== replyId));
//         onDeleteReply(commentId, replyId);
//       }
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   const handleEditReply = (commentId, replyId, newContent) => {
//     setReplies((prevReplies) =>
//       prevReplies.map((reply) =>
//         reply._id === replyId ? { ...reply, content: newContent } : reply
//       )
//     );
//     onEditReply(commentId, replyId, newContent);
//   };

//   const handleLikeReply = async (commentId, replyId) => {
//     try {
//       const res = await fetch(
//         `/api/comment/likeReply/${commentId}/${replyId}`,
//         {
//           method: "PUT",
//         }
//       );
//       if (res.ok) {
//         const updatedComment = await res.json();
//         setReplies(updatedComment.replies);
//         onLikeReply(commentId, replyId);
//       }
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   const canModify = currentUser && currentUser._id === comment.userId;

//   return (
//     <div className="flex flex-col p-4 border-b dark:border-gray-600 text-sm">
//       <div className="flex">
//         <div className="flex-shrink-0 mr-3">
//           <img
//             className="w-10 h-10 rounded-full bg-gray-200"
//             src={user.profilePicture}
//             alt={user.username}
//           />
//         </div>
//         <div className="flex-1">
//           <div className="flex items-center mb-1">
//             <span className="font-bold mr-1 text-xs truncate">
//               {user ? `@${user.username}` : "anonymous user"}
//             </span>
//             <span className="text-gray-500 text-xs">
//               {moment(comment.createdAt).fromNow()}
//             </span>
//           </div>
//           {isEditing ? (
//             <>
//               <textarea
//                 className="mb-2 w-full rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 value={editedContent}
//                 onChange={(e) => setEditedContent(e.target.value)}
//               />
//               <div className="flex justify-end gap-2 text-xs">
//                 <button
//                   onClick={handleSave}
//                   className="bg-purple-700 px-4 py-2 hover:!bg-purple-600 rounded-lg text-white"
//                 >
//                   Save
//                 </button>
//                 <button
//                   onClick={() => setIsEditing(false)}
//                   className="bg-red-700 hover:!bg-red-600 px-2 py-2 rounded-lg text-white focus:ring-purple-900"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </>
//           ) : (
//             <>
//               <p className="text-gray-500 pb-2">{comment.content}</p>
//               <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
//                 <button
//                   type="button"
//                   onClick={() => onLike(comment._id)}
//                   className={`text-gray-400 hover:text-blue-500 ${
//                     currentUser &&
//                     comment.likes.includes(currentUser._id) &&
//                     "!text-blue-500"
//                   }`}
//                 >
//                   <FaThumbsUp className="text-sm" />
//                 </button>
//                 <p className="text-gray-400">
//                   {comment.numberOfLikes > 0 &&
//                     comment.numberOfLikes +
//                       " " +
//                       (comment.numberOfLikes === 1 ? "like" : "likes")}
//                 </p>
//                 <button
//                   type="button"
//                   onClick={() => setIsReplying(!isReplying)}
//                   className="text-gray-400 hover:text-blue-500"
//                 >
//                   <FaReply className="text-sm" />
//                 </button>
//                 {canModify && (
//                   <>
//                     <button
//                       onClick={handleEdit}
//                       className="text-gray-400 hover:text-blue-500"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => onDelete(comment._id)}
//                       className="text-gray-400 hover:text-red-500"
//                     >
//                       Delete
//                     </button>
//                   </>
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//       {isReplying && (
//         <div className="mt-4 ml-8">
//           <textarea
//             className="w-full rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
//             placeholder="Write a reply..."
//             value={replyContent}
//             onChange={(e) => setReplyContent(e.target.value)}
//             rows={3}
//           />
//           <div className="flex justify-end gap-2 mt-2">
//             <button
//               className="bg-purple-700 px-4 py-2 hover:!bg-purple-600 rounded-lg text-white"
//               onClick={handleReply}
//             >
//               Reply
//             </button>
//             <button
//               className="bg-red-700 hover:!bg-red-600 px-2 py-2 rounded-lg text-white focus:ring-purple-900"
//               onClick={() => setIsReplying(false)}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//       {replies.map((reply) => (
//         <Reply
//           key={reply._id}
//           reply={reply}
//           commentId={comment._id}
//           onLike={handleLikeReply}
//           onEdit={handleEditReply}
//           onDelete={handleDeleteReply}
//         />
//       ))}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import moment from "moment";
import { FaThumbsUp, FaReply } from "react-icons/fa";
import { useSelector } from "react-redux";
import axios from "axios";
import Popup from "./modal/ErrorAndSuccesPopup";
import { useNavigate } from "react-router-dom";

const Reply = ({ reply, onLike, onEdit, onDelete, commentId }) => {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editReplyError, setEditReplyError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editedContent, setEditedContent] = useState(reply.content);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACK_END_URL}/api/user/${reply.userId}`,
          {
            withCredentials: true,
          }
        );
        setUser(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    getUser();
  }, [reply.userId]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(reply.content);
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${
          import.meta.env.VITE_BACK_END_URL
        }/api/comment/editReply/${commentId}/${reply._id}`,
        {
          content: editedContent,
        },
        {
          withCredentials: true,
        }
      );
      setIsEditing(false);
      onEdit(commentId, reply._id, editedContent);
    } catch (error) {
      setEditReplyError(error.response.data.message);
      console.error(error.message);
    }
  };

  const handleDeleteClick = () => {
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    onDelete(commentId, reply._id);
    setShowModal(false);
  };

  const canModify = currentUser && currentUser._id === reply.userId;

  return (
    <div className="flex p-4 border-t dark:border-gray-600 text-sm ml-8">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-8 h-8 rounded-full bg-gray-200"
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(reply.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <textarea
              className="mb-2 w-full rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                className="bg-purple-700 px-4 py-2 hover:!bg-purple-600 rounded-lg text-white"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="bg-red-700 hover:!bg-red-600 px-2 py-2 rounded-lg text-white focus:ring-purple-900"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-2">{reply.content}</p>
            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
              <button
                type="button"
                onClick={() => onLike(commentId, reply._id)}
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  reply.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="text-gray-400">
                {reply.numberOfLikes > 0 &&
                  reply.numberOfLikes +
                    " " +
                    (reply.numberOfLikes === 1 ? "like" : "likes")}
              </p>
              {canModify && (
                <>
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="text-gray-400 hover:text-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteClick}
                    className="text-gray-400 hover:text-red-500"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
      {editReplyError && (
        <Popup
          message={editReplyError}
          type="error"
          onClose={() => setEditReplyError(null)}
        />
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-5 max-w-sm w-full">
            <h3 className="text-lg text-gray-700 mb-4 text-center">
              Are you sure you want to delete this reply?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                onClick={handleConfirmDelete}
              >
                Yes, I&apos;m sure
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                onClick={() => setShowModal(false)}
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Comment({
  comment,
  onLike,
  onEdit,
  onDelete,
  onReply,
  // onLikeReply,
  onEditReply,
  onDeleteReply,
}) {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [replyError, setReplyError] = useState("");
  const [commentError, setCommentError] = useState("");
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replies, setReplies] = useState(comment.replies);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACK_END_URL}/api/user/${comment.userId}`,
          {
            withCredentials: true,
          }
        );
        setUser(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    getUser();
  }, [comment.userId]);

  useEffect(() => {
    setReplies(comment.replies);
  }, [comment.replies]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACK_END_URL}/api/comment/editComment/${
          comment._id
        }`,
        {
          content: editedContent,
        },
        {
          withCredentials: true,
        }
      );
      setIsEditing(false);
      onEdit(comment, editedContent);
    } catch (error) {
      if (error.response && error.response.data) {
        setCommentError(error.response.data.message);
      } else {
        setCommentError("Something went wrong while editing comment");
      }
      console.error(error.message);
    }
  };

  const handleReply = async () => {
    try {
      const { data: updatedComment } = await axios.post(
        `${import.meta.env.VITE_BACK_END_URL}/api/comment/createReply`,
        {
          content: replyContent,
          commentId: comment._id,
          userId: currentUser._id,
        },
        {
          withCredentials: true,
        }
      );
      setReplies(updatedComment.replies);
      setIsReplying(false);
      setReplyContent("");
      onReply(comment._id, updatedComment);
    } catch (error) {
      setReplyError(error.response?.data?.message);
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_BACK_END_URL
        }/api/comment/deleteReply/${commentId}/${replyId}`,
        {
          withCredentials: true,
        }
      );
      setReplies(replies.filter((reply) => reply._id !== replyId));
      onDeleteReply(commentId, replyId);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleEditReply = (commentId, replyId, newContent) => {
    setReplies((prevReplies) =>
      prevReplies.map((reply) =>
        reply._id === replyId ? { ...reply, content: newContent } : reply
      )
    );
    onEditReply(commentId, replyId, newContent);
  };

  // const handleLikeReply = async (commentId, replyId) => {
  //   try {
  //     const { data: updatedComment } = await axios.put(
  //       `${import.meta.env.VITE_BACK_END_URL}/api/comment/likeReply/${commentId}/${replyId}`,
  //       {
  //         withCredentials: true,
  //       }
  //     );
  //     setReplies(updatedComment.replies);
  //     onLikeReply(commentId, replyId);
  //   } catch (error) {
  //     console.error(error.message);
  //   }
  // };

  const handleLikeReply = async (commentId, replyId) => {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }

    try {
      const { data } = await axios.put(
        `${
          import.meta.env.VITE_BACK_END_URL
        }/api/comment/likeReply/${commentId}/${replyId}`,
        null, // Empty body
        { withCredentials: true }
      );

      setReplies((prevReplies) =>
        prevReplies.map((reply) =>
          reply._id === replyId
            ? { ...reply, likes: data.likes, numberOfLikes: data.numberOfLikes }
            : reply
        )
        
      );
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      // showToast("Failed to like the reply. Please try again.");
    }
  };

  const canModify = currentUser && currentUser._id === comment.userId;

  return (
    <div className="flex flex-col p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex">
        <div className="flex-shrink-0 mr-3">
          <img
            className="w-10 h-10 rounded-full bg-gray-200"
            src={user.profilePicture}
            alt={user.username}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <span className="font-bold mr-1 text-xs truncate">
              {user ? `@${user.username}` : "anonymous user"}
            </span>
            <span className="text-gray-500 text-xs">
              {moment(comment.createdAt).fromNow()}
            </span>
          </div>
          {isEditing ? (
            <>
              <textarea
                className="mb-2 w-full rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
              <div className="flex justify-end gap-2 text-xs">
                <button
                  onClick={handleSave}
                  className="bg-purple-700 px-4 py-2 hover:!bg-purple-600 rounded-lg text-white"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-red-700 hover:!bg-red-600 px-2 py-2 rounded-lg text-white focus:ring-purple-900"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-500 pb-2">{comment.content}</p>
              <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
                <button
                  type="button"
                  onClick={() => onLike(comment._id)}
                  className={`text-gray-400 hover:text-blue-500 ${
                    currentUser &&
                    comment.likes.includes(currentUser._id) &&
                    "!text-blue-500"
                  }`}
                >
                  <FaThumbsUp className="text-sm" />
                </button>
                <p className="text-gray-400">
                  {comment.numberOfLikes > 0 &&
                    comment.numberOfLikes +
                      " " +
                      (comment.numberOfLikes === 1 ? "like" : "likes")}
                </p>
                <button
                  type="button"
                  onClick={() => setIsReplying(!isReplying)}
                  className="text-gray-400 hover:text-blue-500"
                >
                  <FaReply className="text-sm" />
                </button>
                {canModify && (
                  <>
                    <button
                      onClick={handleEdit}
                      className="text-gray-400 hover:text-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(comment._id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      {isReplying && (
        <div className="mt-4 ml-8">
          <textarea
            className="w-full rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Write a reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end gap-2 mt-2 mb-2">
            <button
              className="bg-purple-700 px-4 py-2 hover:!bg-purple-600 rounded-lg text-white"
              onClick={handleReply}
            >
              Reply
            </button>
            <button
              className="bg-red-700 hover:!bg-red-600 px-2 py-2 rounded-lg text-white focus:ring-purple-900"
              onClick={() => setIsReplying(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {replies
        .slice()
        .reverse()
        .map((reply) => (
          <Reply
            key={reply._id}
            reply={reply}
            commentId={comment._id}
            onLike={handleLikeReply}
            onEdit={handleEditReply}
            onDelete={handleDeleteReply}
          />
        ))}

      {replyError && (
        <Popup
          message={replyError}
          type="error"
          onClose={() => setReplyError(null)}
        />
      )}

      {commentError && (
        <Popup
          message={commentError}
          type="error"
          onClose={() => setCommentError(null)}
        />
      )}
    </div>
  );
}
