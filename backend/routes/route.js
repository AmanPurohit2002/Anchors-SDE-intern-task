const express=require('express');
const { signUpUser, getAllUser,loginUser, posts, comments, replies, getAllPosts, getAllCommentedPosts, getAllRepliedPosts, getAllPostOfUser, loginByOtp } = require('../controllers/controller');

const router=express.Router();

router.post('/signUp',signUpUser);
router.post('/newLogin',loginUser);
router.post('/login',loginByOtp);
router.get('/user',getAllUser)
router.post('/post',posts);
router.post('/comment',comments);
router.post('/reply',replies);
router.get('/posts/:userId',getAllPosts);
router.get('/commented-posts/:userId',getAllCommentedPosts)
router.get('/replied-posts/:userId',getAllRepliedPosts);
router.get('/activity/:userId',getAllPostOfUser);



module.exports=router;