const mongoose=require('mongoose');
const { type } = require('../schema');
const { ref } = require('joi');
const Schema=mongoose.Schema;

const postSchema= new Schema({
    image:{
        url:String,
        filename:String,
    },
     title:{
        type:String,
        required:true,
     },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    board:[{
        type:Schema.Types.ObjectId,
        ref:'Board'
    }],
    description:String,
    createdAt:{
        type:Date,
        default:Date.now,
    },
    createdBy:{
       type:Schema.Types.ObjectId,
       ref:'User'
    },
    comments:[{
        type:Schema.Types.ObjectId,
        ref:'Comment'
    }],
    allowComments:{
        type:Boolean,
    },
});

const Post= mongoose.model('Post',postSchema);
module.exports=Post