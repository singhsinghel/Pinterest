const Post = require('../models/postModel');
const User = require('../models/userModel');
const Board = require('../models/boardModel');
const ExpressError = require('../utils/ExpressError');
const Comment=require('../models/commentModel');
const passport=require('passport');
const {commentSchema}=require('../schema');


module.exports.pins=async(req,res)=>{
    let orgpins=await Post.find(); 
    const pins = orgpins.map(pin => {
            pin.image.url = pin.image.url.replace('/upload', '/upload/w_400');
           return pin;
    });
    
    let user=await User.findById(req.user._id).populate('posts').populate('boards');
    res.render('pins',{pins,user});
}

module.exports.renderForm=async (req,res)=>{
    let id=req.params.userId;
    let user=await User.findById(id).populate('boards');
    res.render('createPost',{user})
}

module.exports.create=async(req,res)=>{
    if (!req.file) {
        req.flash('error', 'Please upload an image');
        return res.redirect('back');
    }
    let url=req.file.path;
    let filename=req.file.filename;
    let id=req.params.userId;
    let user=await User.findById(id);
    console.log(req.body);
    
    let{title,description,board,allowComments}=req.body;

    const newPost= new Post({title:title,image:{url,filename},description:description,board:board,allowComments});
    
    if (!newPost.board || newPost.board.length === 0) {
        // Handle scenario where no board is present
        newPost.board = []; // Or set a default board
    }
    
    if(board){
    const parentBoard= await Board.findById(board);
 
    await parentBoard.pins.push(newPost._id);
    parentBoard.save();
    }
    
    newPost.createdBy=req.user._id;
    await newPost.save();
    user.posts.push(newPost._id);
    await user.save();
    req.flash('success','Piin created');
    res.redirect(`/users/${id}/profile`)

}


module.exports.search=async(req,res)=>{
    const {search}= req.query;    
    if (!search) {
     req.flash('error','Enter something to search');
     res.redirect('/pins');
    }
    const regex = new RegExp(search, 'i'); 
    const searchFields = ['title', 'description']; 
    const searchConditions = searchFields.map(field => ({
    [field]: { $regex: regex }
    }));
    const pins= await Post.find({ $or:searchConditions}); 
    let user=await User.findById(req.user._id).populate('posts').populate('boards'); 
      res.render('pins',{pins,user});
 }

 module.exports.showPin=async(req,res)=>{
    const id=req.params.pinId;
    const pin= await Post.findById(id).populate('board').populate('createdBy').populate({
        path:'comments',
        populate:{
            path:'user',
            select:'username dp'
        }
    }).exec()
    const user=await User.findById(req.user._id).populate('boards');

    const isFollowing= pin.createdBy.followers.includes(req.user._id.toString());
    const isLiked=pin.likes.includes(req.user.id.toString());
    res.render('showPins',{pin,isFollowing,isLiked,user})
 }

 module.exports.editPin=async(req,res)=>{
    try{
    let pinId=req.params.pinId;
    let {title,description,board,allowComments}=req.body;
    console.log('body',req.body);
    
   const pin= await Post.findByIdAndUpdate(pinId,{title,description,allowComments},{new:true});
   
    if(board&&board.trim()!==''){
    const orgBoard=await Board.findById(board);

    if(orgBoard.pins.includes(pinId))
    return res.redirect('back');
    
    await pin.board.push(board);
    await pin.save();

    await orgBoard.pins.push(pinId);
    await orgBoard.save(); 
    }
    
    if(!allowComments){
     pin.allowComments=false;
     await pin.save();
    }
    res.redirect('back');
   }catch(err){    
    throw new ExpressError(500,err.message)
   }
 }

 module.exports.deletePin=async(req,res)=>{
    let id= req.params.pinId;

    await User.findByIdAndUpdate(req.user._id,{$pull:{posts:id}},{new:true});

    const pin= await Post.findById(id);
    const pincomments=pin.comments;

    await Comment.deleteMany({_id : {$in:pincomments}}) ;

    if (pin.board) {
       await Board.updateMany({ _id: { $in: pin.board } }, { $pull: { pins: id } });
   }
    await Post.findByIdAndDelete(id);
    req.flash('success','Pin deleted Successfully')
    res.redirect('/pins');
}

module.exports.postComment=async(req,res)=>{

    let result=commentSchema.validate(req.body);
    if(result.error)
    {  
        req.flash('error','Comment cannot be empty');
       return res.redirect('back');
    }
     let {comment}=req.body;
    
   const id=req.params.pinId
   const pin= await Post.findById(id);
  
    if (!pin.board || pin.board.length === 0) {
        // Handle scenario where no board is present
        pin.board = []; // Or set a default board
    }
   const commentdb= new Comment({comment:comment,user:req.user._id,post:id});
   await commentdb.save();
    
   pin.comments.push(commentdb._id);
   await pin.save();
   
   req.flash('success', 'Comment added successfully');
   res.redirect('back')
  
 };

 module.exports.editComment= async(req,res)=>{

    let id=req.params.commentId;
    const {editedComment}=req.body;
    const comment= await Comment.findById(id);

    comment.comment=editedComment;
     await comment.save();
     res.redirect('back');
 }

 module.exports.deleteComment=async(req,res)=>{
    let {commentId,pinId}=req.params;

    await Post.findByIdAndUpdate(pinId,{$pull:{comments:commentId}});
    await Comment.findByIdAndDelete(commentId);
    
    req.flash('success',"Comment deleted");
    res.send('back');
}

module.exports.like=async(req,res)=>{
    let id=req.params.pinId;
    let userId=req.user._id;
    
    try{
    const pin=await Post.findById(id);
    
    if (!pin.board || pin.board.length === 0) {
        pin.board = []; // Or set a default board
    }
    if(!pin.likes.includes(userId)){
       pin.likes.push(userId);
       await pin.save();
    }
    req.flash('success','liked');
    res.redirect('back');
}catch(err){

    req.flash('error',err.message)
    return res.redirect('back');
   
}
}

module.exports.unlike=async(req,res)=>{
    let id=req.params.pinId;
    let userId=req.user._id.toString();

    let pin=await Post.findById(id);
    pin.likes=pin.likes.filter(liker=>liker.toString()!==userId);
    await pin.save();
    req.flash('success','unliked');
    res.redirect('back');
 }