const User = require('../models/userModel');
const Board = require('../models/boardModel');
const Post = require('../models/postModel');

module.exports.boardCreate=async(req,res)=>{
    let {name,isSecret}=req.body;
    const newBoard= new Board({name:name,user:req.user._id,isSecret});

    await newBoard.save();
    
    let userId=req.user._id
    const user= await User.findById(userId);

    user.boards.push(newBoard._id);
    await user.save();
    console.log(user);
    res.redirect('back')
};

module.exports.showBoard=async (req,res)=>{
    let boardId=req.params.boardId;
    const board=await Board.findById(boardId).populate('pins');
    console.log(board);
    res.render('showBoard',{board});
};

module.exports.editBoard=async (req,res)=>{
    let {name, description,isSecret}=req.body;
    console.log(req.body);
    await Board.findByIdAndUpdate(req.params.boardId,{name:name,description:description,isSecret});
    res.redirect('back');
}

module.exports.deleteBoard=async(req,res)=>{
    let {boardId}=req.params;
    let pins = await Post.find();

    pins.forEach(async (pin )=> {
        if(pin.board&& pin.board.includes(boardId)){
        pin.board=pin.board.filter(id=>id.toString()!==boardId)
        }
        else if (pin.board && pin.board.toString() === boardId) {
            pin.board = [];
            await pin.save();
        }
    });
    
    await User.findByIdAndUpdate(req.user._id,{$pull:{boards:boardId}},{new:true})
    await Board.findByIdAndDelete(boardId);
     

    req.flash('success','Board deleted Successfully');
    res.redirect(`/users/${req.user._id}/profile`);
}

module.exports.savePin= async(req,res)=>{
    let {boardId,pinId}=req.params;

    const orgBoard=await Board.findById(boardId);
    const pin=await Post.findById(pinId);
    if(orgBoard.pins.includes(pinId))
    {   
        req.flash('success',`Pin already exists in board ${orgBoard.name}`)
        return res.redirect('back');
    }
    await pin.board.push(boardId);
    await pin.save();

    await orgBoard.pins.push(pinId);
    await orgBoard.save(); 
     
    req.flash('success',`Added to board ${orgBoard.name}`)
    res.redirect('back')
};

module.exports.unsavePin= async (req, res) => {
    const { boardId, pinId } = req.params;

    try {
        
        const board = await Board.findById(boardId);
      
        const pinIndex = board.pins.indexOf(pinId);
        if (pinIndex === -1) {
            return res.status(404).send('Pin not found in board');
        }

        board.pins.splice(pinIndex, 1);

        await board.save();

        res.redirect('back');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}