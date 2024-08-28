const express= require('express');
const { isLoggedIn, isBoardExists, isPinExists, validateBoard } = require('../middleware');
const WrapAsync= require('../utils/WrapAsync.js');
const boardController=require('../controllers/boardController.js');
const router=express.Router();

router.post('/:userId/create', isLoggedIn,validateBoard, WrapAsync(boardController.boardCreate));


router.route('/:boardId')
.get(isBoardExists, WrapAsync(boardController.showBoard))

.put( isBoardExists,validateBoard,WrapAsync(boardController.editBoard))

.delete( isBoardExists, WrapAsync(boardController.deleteBoard));

router.get('/:boardId/:pinId/save', isBoardExists,isPinExists,WrapAsync(boardController.savePin));

router.get('/:boardId/:pinId/unsave', isBoardExists,isPinExists,WrapAsync(boardController.unsavePin));
module.exports=router;