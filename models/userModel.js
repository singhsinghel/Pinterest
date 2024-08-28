const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose');

const userSchema= new Schema({
   email:{
    type:String,
    required:true,
    unique:true,
   },

   fullName:{
    type:String,
    required:true,
   },

   posts:[{
    type:Schema.Types.ObjectId,
    ref:'Post'
   }],
   boards:[{
      type:Schema.Types.ObjectId,
      ref:'Board'
   }],
   saved:[{
      type:Schema.Types.ObjectId,
      ref:'Post'
   }],

   dp:{
    url:String,
    filename:String,
   },
   
   about:{
      type:String,
      default:" ",

   },
   followers: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
   }],

   following: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
   }],
});
userSchema.plugin(passportLocalMongoose);
const User=mongoose.model('User',userSchema);

module.exports=User;
