const Post = require("./models/postModel");
const Comment=require('./models/commentModel');
const {userSchema,pinSchema, boardSchema} = require("./schema");
const ExpressError = require("./utils/ExpressError");
const Board = require("./models/boardModel");

module.exports.isLoggedIn=(req,res,next)=>
    {
        if(!req.isAuthenticated()) {
            req.session.redirectUrl=req.originalUrl;
            req.flash('error','You must be logged in');
            res.redirect('/users/login');
          }
          next();
    }

module.exports.validateUser=(req,res,next)=>{
    let result=userSchema.validate(req.body);
    if(result.error)
        throw new ExpressError(400,result.error);
    else next();
}    
module.exports.validatePin=(req,res,next)=>{
    let result=pinSchema.validate(req.body);
    if(result.error)
        throw new ExpressError(400,result.error);
    else next();
}    
module.exports.validateBoard=(req,res,next)=>{
     let result=boardSchema.validate(req.body);
     if(result.error)
        throw new ExpressError(400,result.error);
    else next();
}
module.exports.isPinExists=async(req,res,next)=>{
    let {pinId}=req.params;
    let pin = await Post.findById(pinId);
    if(!pin){
        return next(new ExpressError(499,'Pin not found.'));
    }
    next();
}
module.exports.isCommentExists=async(req,res,next)=>{
    let {commentId}=req.params;
    let comment = await Comment.findById(commentId)
    if(!comment){
        return next(new ExpressError(499,'Comment not found.'));
    }
    next();
}
module.exports.isBoardExists=async(req,res,next)=>{
    let {boardId}=req.params;
    let board = await Board.findById(boardId)
    if(!board){
        return next(new ExpressError(499,'Board not found.'));
    }
    next();
}