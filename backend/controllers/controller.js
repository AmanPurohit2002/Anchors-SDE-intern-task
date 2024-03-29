const Post = require("../models/Post");
const User = require("../models/User");
const { generatetOtp, sendOtp, sendNotifications } = require("../otp/otp");
const mongoose = require("mongoose");

const loginByOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const getOtp = generatetOtp();

    const existingUser = await User.findOneAndUpdate(
      { email },
      { $set: { otp: getOtp } },
      { new: true }
    );

    if (!existingUser) {
      return res.status(404).json({ error: "User not found." });
    }

    await sendOtp(email, getOtp);

    return res.status(201).json({
      message:
        "Account created successfully. Check your email for OTP verification.",
    });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

const signUpUser = async (req, res) => {
  try {
    const { name, email, otp } = req.body;

    const existingUser = await User.findOne({ email, otp });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    const getOtp = generatetOtp();

    const newUser = await User.create({
      name,
      email,
      otp: getOtp,
    });

    // send otp to mail
    await sendOtp(email, getOtp);

    // res.status(201).json({ message: 'Account created successfully. Check your email for OTP verification.' });
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and otp are required" });
    }
    const user = await User.findOne({ email, otp });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    user.otp = undefined;
    await user.save();

    // res.status(200).json({ message: 'Login successful' });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

// const getAllUser = async (req, res) => {
//   try {
//     const userData = await User.find().sort({ _id: -1 });

//     res.status(200).json(userData);
//   } catch (error) {
//     return res.status(401).json({ error: error.message });
//   }
// };

const getAllUser = async (req, res) => {
  try {
    const postsData = await Post.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'postId',
          as: 'comments',
        },
      },
      {
        $unwind: {
          path: '$comments',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'comments.userId',
          foreignField: '_id',
          as: 'commentUser',
        },
      },
      {
        $unwind: {
          path: '$comments.replies',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'comments.replies.userId',
          foreignField: '_id',
          as: 'replyUser',
        },
      },
      {
        $group: {
          _id: {
            userId: '$user._id',
            postId: '$_id',
          },
          name: { $first: '$user.name' },
          email: { $first: '$user.email' },
          posts: {
            $push: {
              postId: '$_id',
              title: '$title',
              description: '$description',
              comments: '$comments',
            },
          },
        },
      },
      {
        $group: {
          _id: '$_id.userId',
          name: { $first: '$name' },
          email: { $first: '$email' },
          posts: {
            $push: {
              postId: '$posts.postId',
              title: '$posts.title',
              description: '$posts.description',
              comments: {
                $push: {
                  commentId: '$posts.comments._id',
                  commentText: '$posts.comments.text',
                  commenter: {
                    userId: '$posts.comments.userId',
                    userName: { $arrayElemAt: ['$commentUser.name', 0] },
                  },
                  replies: {
                    $push: {
                      replyId: '$posts.comments.replies._id',
                      replyText: '$posts.comments.replies.text',
                      replier: {
                        userId: '$posts.comments.replies.userId',
                        userName: { $arrayElemAt: ['$replyUser.name', 0] },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    ]);

    res.status(200).json(postsData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};














const posts = async (req, res) => {
  try {
    const { title, description, userId } = req.body;

    if (!title || !description || !userId) {
      return res.status(404).json("title, description are requried");
    }

    const newPost = await Post.create({
      title,
      description,
      userId,
    });

    const user = await User.findById(userId);

    if (user) {
      const congratulatoryMessage = `
    <div style="max-width: 400px; margin: 20px auto; padding: 20px; text-align: center; background-color: #f8f8f8; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #009688;">Congratulations!</h2>
        <p style="color: #444;">Your post "<strong>${title}</strong>" is now live.</p>
    </div>
`;

      await sendNotifications(
        user.email,
        "Congratulations!",
        congratulatoryMessage
      );
    }

    // res.status(201).json({ message: 'Post created successfully' });
    return res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const comments = async (req, res) => {
  try {
    const { postId, text, userId } = req.body;

    if (!postId || !text || !userId) {
      return res.status(400).json("text is required");
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    post.comments.push({ text, userId });
    await post.save();

    const postOwner = await User.findById(post.userId);

    if (postOwner) {
      const commentingUser = await User.findById(userId);
      const commentNotificationMessage = `
    <div style="max-width: 400px; margin: 20px auto; padding: 20px; text-align: center; background-color: #f8f8f8; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #009688;">New Comment!</h2>
        <p style="color: #444;"><strong>${commentingUser.name}</strong> commented on your post title "<strong>${post.title}</strong>".</p>
    </div>
`;

      await sendNotifications(
        postOwner.email,
        "New Comment",
        commentNotificationMessage
      );
    }

    // res.status(201).json({ message: 'Comment added successfully' });
    return res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const replies = async (req, res) => {
  try {
    const { commentId, postId, text, userId } = req.body;

    if (!commentId || !postId || !text || !userId) {
      return res.status(404).json("text is required");
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    comment.replies.push({ text, userId });
    await post.save();

    // Send email to the user who made the original comment
    const originalCommenter = await User.findById(comment.userId);
    if (originalCommenter) {
      const commentingUser = await User.findById(userId);
      const replyNotificationMessage = `
        <div style="max-width: 400px; margin: 20px auto; padding: 20px; text-align: center; background-color: #f8f8f8; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <p style="color: #444;"><strong>${commentingUser.name}</strong> replied to your comment on post "<strong>${post.title}</strong>".</p>
        </div>
    `;
      await sendNotifications(
        originalCommenter.email,
        "New Reply",
        replyNotificationMessage
      );
    }

    // Send email to the user who created the post
    const postOwner = await User.findById(post.userId);
    if (postOwner) {
      const postOwnerNotificationMessage = `
        <div style="max-width: 400px; margin: 20px auto; padding: 20px; text-align: center; background-color: #f8f8f8; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <p style="color: #444;">Users are replying on your post "<strong>${post.title}</strong>".</p>
        </div>
    `;
      await sendNotifications(
        postOwner.email,
        "New Reply",
        postOwnerNotificationMessage
      );
    }

    // res.status(201).json({ message: 'Reply added successfully' });
    return res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getAllPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await Post.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) },
      },
      {
        $project: {
          _id: 1,
          postId: "$_id", // Include the postId field
          userId: 1, // Include the userId field
          title: 1,
          description: 1,
          totalComments: { $size: "$comments" },
          totalReplies: {
            $sum: {
              $map: {
                input: "$comments",
                as: "comment",
                in: { $size: "$$comment.replies" },
              },
            },
          },
        },
      },
    ]);

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const getAllCommentedPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    const commentedPosts = await Post.aggregate([
      {
        $match: {
          "comments.userId": new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $unwind: "$comments",
      },
      {
        $match: {
          "comments.userId": new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "users", // Replace with your actual user collection name
          localField: "comments.userId",
          foreignField: "_id",
          as: "commenter",
        },
      },
      {
        $lookup: {
          from: "users", // Replace with your actual user collection name
          localField: "userId",
          foreignField: "_id",
          as: "postOwner",
        },
      },
      {
        $project: {
          _id: 0,
          postId: "$_id",
          comment: "$comments.text",
          commenterId: "$commenter._id",
          commenterName: "$commenter.name",
          postTitle: "$title",
          postOwnerId: "$postOwner._id",
          postOwnerName: "$postOwner.name",
        },
      },
    ]);

    res.status(200).json(commentedPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




const getAllRepliedPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    const repliedPosts = await Post.aggregate([
      {
        $match: {
          "comments.replies.userId": new mongoose.Types.ObjectId(userId),
          $or: [
            { "comments.text": { $exists: true, $ne: "" } }, // Include posts with original comments
            { "comments.replies.text": { $exists: true, $ne: "" } }, // Include posts with replies
          ],
        },
      },
      {
        $unwind: "$comments",
      },
      {
        $unwind: {
          path: "$comments.replies",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "users", // Replace with your actual user collection name
          localField: "comments.userId",
          foreignField: "_id",
          as: "commenterInfo",
        },
      },
      {
        $unwind: "$commenterInfo",
      },
      {
        $lookup: {
          from: "users", // Replace with your actual user collection name
          localField: "comments.replies.userId",
          foreignField: "_id",
          as: "replierInfo",
        },
      },
      {
        $unwind: "$replierInfo",
      },
      {
        $project: {
          postId: "$_id",
          comment: "$comments.text",
          commentAuthorId: "$comments.userId",
          commentAuthorName: "$commenterInfo.name", // Assuming the name field in your user collection
          reply: "$comments.replies.text",
          replierId: "$comments.replies.userId",
          replierName: "$replierInfo.name", // Assuming the name field in your user collection
          postTitle: "$title", // Replace with the actual field representing post title
          postAuthorId: "$userId",
          postAuthorName: "$replierInfo.name", // Assuming the name field in your user collection
        },
      },
    ]);

    res.status(200).json(repliedPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};






module.exports = {
  getAllRepliedPosts,
};

const getAllPostOfUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId }).sort({ _id: -1 });

    res.status(201).json(posts);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getSpecificUserPost = async (req, res) => {
  try {
    const { userId, postId } = req.params;

    const post = await Post.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(postId), userId: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "users", // Replace with your actual user collection name
          localField: "comments.userId",
          foreignField: "_id",
          as: "commentUsers",
        },
      },
      {
        $unwind: { path: "$comments", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "users", // Replace with your actual user collection name
          localField: "comments.replies.userId",
          foreignField: "_id",
          as: "replyUsers",
        },
      },
      {
        $unwind: { path: "$comments.replies", preserveNullAndEmptyArrays: true },
      },
      {
        $group: {
          _id: "$_id",
          userId: { $first: "$userId" },
          title: { $first: "$title" },
          description: { $first: "$description" },
          totalComments: { $sum: { $cond: { if: "$comments", then: 1, else: 0 } } },
          totalReplies: { $sum: { $cond: { if: "$comments.replies", then: 1, else: 0 } } },
          comments: {
            $push: {
              _id: "$comments._id",
              text: "$comments.text",
              commenterId: "$comments.userId",
              commenterName: { $arrayElemAt: ["$commentUsers.name", 0] },
              replies: {
                $cond: {
                  if: "$comments.replies",
                  then: [{
                    _id: "$comments.replies._id",
                    text: "$comments.replies.text",
                    replierId: "$comments.replies.userId",
                    replierName: { $arrayElemAt: ["$replyUsers.name", 0] },
                  }],
                  else: [],
                },
              },
            },
          },
        },
      },
    ]);

    if (!post || post.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};






module.exports = {
  signUpUser,
  loginUser,
  getAllUser,
  posts,
  comments,
  replies,
  getAllPosts,
  getAllCommentedPosts,
  getAllRepliedPosts,
  getAllPostOfUser,
  loginByOtp,
  getSpecificUserPost
};
