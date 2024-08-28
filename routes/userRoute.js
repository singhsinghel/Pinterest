const express= require('express');
const { isLoggedIn, validateUser } = require('../middleware');
const User = require('../models/userModel');
const router=express.Router();
const passport=require('passport');
const multer=require('multer');
const {cloudinary , storage}= require('../utils/cloudConfig');
const ExpressError = require('../utils/ExpressError');
const upload= multer({storage});
const userController=require('../controllers/userController');

const WrapAsync = require('../utils/WrapAsync');


router.get('/signup',(req,res)=>{ 
   res.render('signup.ejs');
});

router.post('/signup', WrapAsync(userController.signup))

router.get('/login',(req,res)=>{    
    res.render('login')
});

router.post('/login',passport.authenticate('local',{
    failureFlash:true,
    failureRedirect:'/users/login',
}),(req,res)=>{
   let {_id}=req.user;
   res.redirect(`/users/${_id}/profile`)
});

router.get('/logout',userController.logout)

router.get('/:userId/profile',isLoggedIn, WrapAsync(userController.showProfile));

router.post('/:id/editdp',upload.single('profileImage'), WrapAsync(userController.editDp))



router.get('/:id/edit',(req,res)=>{
    res.render('editProfile')
});

router.post('/:id/edit', isLoggedIn, WrapAsync(userController.editProfile));

router.get('/:id/follow', WrapAsync(userController.follow));

router.get('/:id/unfollow',WrapAsync(userController.unFollow));

module.exports=router;
