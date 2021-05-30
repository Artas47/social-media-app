const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const UserModel = require("../models/UserModel");
const PostModel = require("../models/PostModel");
const FollowerModel = require("../models/FollowerModel");
const uuid = require("uuid").v4;

router.post("/", authMiddleware, async (req, res) => {
  const { text, location, picUrl } = req.body;

  if (text.length < 1)
    return res.status(401).send("Text must be atleast 1 character");

  try {
    const newPost = {
      user: req.userId,
      text,
    };
    if (location) newPost.location = location;
    if (picUrl) newPost.picUrl = picUrl;
    const post = await new PostModel(newPost).save();

    const createdPost = await PostModel.findById(post._id).populate("user");

    return res.json(createdPost);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

router.get("/", authMiddleware, async (req, res) => {
    const {pageNumber} = req.query;
    const number = Number(pageNumber);
    const size = 8;
  try {
      let posts;
      if(number === 1){
        posts = await PostModel.find()
        .limit(size)
        .sort({ createdAt: -1 })
        .populate("user")
        .populate("comments.user");
      } else {
          const skips = size * (number - 1);
          posts = await PostModel.find().skip(skips).limit(size).sort({createdAt: -1}).populate('user').populate('comments.user');
      }
    
    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

router.get("/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).send("Post not found");
    }
    return res.status(200).json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

router.delete("/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req;
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).send("Post not found");
    }
    const user = await UserModel.findById(userId);
    if (post.user.toString() !== userId) {
      if (user.role === "root") {
        await post.remove();
        return res.status(200).send("Post deleted");
      } else {
        return res.status(401).send("Unauthorized");
      }
    }
    await post.remove();
    return res.status(200).send("Post deleted");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

router.post("/like/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req;

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).send("Post not found");
    }
    const isLiked =
      post.likes.filter((like) => like.user.toString() === userId).length > 0;
    if (isLiked) {
      return res.status(401).send("Post already liked");
    }

    await post.likes.unshift({ user: userId });
    await post.save();

    return res.status(200).send("Post liked");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

router.put("/unlike/:postId", authMiddleware, async (req, res) => {
  try {
    const postId = req.params;
    const { userId } = req;

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).send("Post not found");
    }
    const isLiked =
      post.likes.filter((like) => like.user.toString() === userId).length === 0;
    if (isLiked) {
      return res.status(401).send("Post not liked before");
    }

    const index = post.likes
      .map((like) => like.user.toString())
      .indexOf(userId);

    await post.likes.splice(index, 1);
    await post.save();
    return res.status(200).send("Post unliked");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

router.get("/like/:postId", authMiddleware, async (req, res) => {
  try {
    const postId = req.params;
    const post = await PostModel.findById(postId).populate("likes.user");
    if (!post) {
      return res.status(404).send("Post not found");
    }
    return res.status(200).send(post.likes);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

router.get("/like/:postId", authMiddleware, async (req, res) => {
  try {
    const postId = req.params;
    const post = await PostModel.findById(postId).populate("likes.user");
    if (!post) {
      return res.status(404).send("Post not found");
    }
    return res.status(200).send(post.likes);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

router.post("/comment/:postId", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).send("Post not found");
    }
    const { text } = req.body;
    if (text.length < 1) {
      return res.status(401).send("Comment should be atlease 1 character");
    }
    const comment = {
      _id: uuid(),
      user: req.userId,
      text,
      date: Date.now(),
    };
    await post.comments.unshift(comment);
    await post.save();
    return res.status(200).send(comment._id);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

router.delete(
  "/comment/:postId/:commentId",
  authMiddleware,
  async (req, res) => {
    try {
      const { postId, commentId } = req.params;
      const post = await PostModel.findById(postId);
      if (!post) {
        return res.status(404).send("Post not found");
      }

      const comment = post.comments.find(
        (comment) => comment._id === commentId
      );
      if (!comment) {
        return res.status(404).send("Comment not found");
      }

      const deleteComment = async () => {
        const indexOf = post.comments
          .map((comment) => comment._id)
          .indexOf(commentId);
        await post.comments.splice(indexOf, 1);
        await post.save();
        return res.status(200).send("Comment deleted");
      };

      const user = await UserModel.findById(req.userId);

      if (comment.user.toString() !== req.userId) {
        if (user.role === "root") {
          await deleteComment();
        } else {
          return res.status(401).send("You cannot delete this post");
        }
      }
      await deleteComment();
    } catch (error) {
      console.error(error);
      return res.status(500).send("Server error");
    }
  }
);

module.exports = router;
