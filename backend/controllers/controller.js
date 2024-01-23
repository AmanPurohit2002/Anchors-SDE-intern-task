const Post = require("../models/Post");
const User = require("../models/User");
const { generatetOtp, sendOtp, sendNotifications } = require("../otp/otp");

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

const getAllUser = async (req, res) => {
  try {
    const userData = await User.find().sort({ _id: -1 });

    res.status(200).json(userData);
  } catch (error) {
    return res.status(401).json({ error: error.message });
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

module.exports = {
  signUpUser,
  loginUser,
  getAllUser,
  posts,
  comments,
  replies,
};
