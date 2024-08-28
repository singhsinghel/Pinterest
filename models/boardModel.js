const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boardSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  cover:{
    url:String,
    fileName:String,
  },
  description: {
    type: String,
    trim: true,
  },
  contributers:{
    type:Schema.Types.ObjectId,
    ref:'User'
  },
  isSecret:{
    type:Boolean
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  pins: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Board = mongoose.model('Board', boardSchema);

module.exports = Board;
