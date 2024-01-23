const express=require('express');
const { signUpUser, getAllUser,loginUser, posts, comments, replies } = require('../controllers/controller');

const router=express.Router();

router.post('/signUp',signUpUser);
router.post('/login',loginUser);
router.get('/user',getAllUser)
router.post('/post',posts);
router.post('/comment',comments);
router.post('/reply',replies);


module.exports=router;