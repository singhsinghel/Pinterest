const express= require('express');
const { isLoggedIn, validateUser,isPinExists, isCommentExists, validatePin } = require('../middleware');

const router=express.Router();
const multer=require('multer');
const {cloudinary , storage}= require('../utils/cloudConfig');
const upload= multer({storage});
const passport=require('passport');

const WrapAsync = require('../utils/WrapAsync');
const pinController=require('../controllers/pinController')


router.get('/',WrapAsync(pinController.pins))

router.get('/back',(req,res)=>{
    res.redirect('/pins');
})

router.route('/:userId/create')
.get(isLoggedIn,WrapAsync(pinController.renderForm))
.post(upload.single('image'),isLoggedIn ,validatePin,WrapAsync(pinController.create))


router.get('/search', WrapAsync(pinController.search) );

router.route('/:pinId')
.get( isPinExists, WrapAsync(pinController.showPin))

.put(isPinExists,WrapAsync(pinController.editPin))

.delete(isPinExists, WrapAsync(pinController.deletePin) )

router.post('/:pinId/comment', isLoggedIn, isPinExists, WrapAsync(pinController.postComment));

router.post('/:commentId/editComment', isCommentExists, WrapAsync(pinController.editComment));

router.get('/:commentId/:pinId/deleteComment', isPinExists, isCommentExists, WrapAsync(pinController.deleteComment));

 router.get('/:pinId/like', isLoggedIn, isPinExists, WrapAsync(pinController.like));

router.get('/:pinId/unlike',isLoggedIn, WrapAsync(pinController.unlike));


 module.exports=router;