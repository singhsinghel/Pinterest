const User = require('../models/userModel');
const passport=require('passport');

module.exports.signup=async (req,res)=>{
    try{
     let {username,email,fullName}=req.body;
     let checkUser=await User.findOne({email:email});
     if(checkUser){
        req.flash('error',"Email already exists !!");
        return res.render('signup')
     }
     else{
     const newUser=new User({
         username:username,
         email:email,
         fullName:fullName,
         dp:{
            url:'https://www.66autocolor.com/cdn/shop/products/11.GRA0898SleekGray_838x.jpg?v=1630091688',
            filename:'Dp'
         }
     });
 
    User.register(newUser,req.body.password).then(()=>{
     passport.authenticate('local')(req,res,()=>{
         res.redirect(`/users/${newUser._id}/profile`)
     })
    });
     res.locals.currUser=newUser;
   }
    }catch(err){
     req.flash('error',err);
 }
 };

 module.exports.login=(req,res)=>{
    let {_id}=req.user;
    res.redirect(`/users/${_id}/profile`)
 }

 module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if (err)
            return next(err)
    })
    req.flash('success',"You are successfully logged out");
    res.redirect('/users/login');
}

module.exports.showProfile=async (req,res)=>{
    let user=await User.findById(req.params.userId).
    populate('following').
    populate('followers').
    populate('posts').
    populate({
      path:'boards',
      populate:{
          path:'pins',
          select:'image title'
     }}).exec();
     const isFollowing = user.followers.map(follower => follower._id.toString()).includes(req.user._id.toString());
     console.log(isFollowing);
     console.log(user);
     
res.render('profile',{user,isFollowing})
};

module.exports.editDp=async(req,res)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    let id=req.params.id;
    let user= await User.findById(id);
    user.dp={url,filename};
    await user.save();
    res.redirect(`/users/${id}/profile`);
};

module.exports.editProfile=async (req, res, next) => {
    try {
        let { firstname, lastname, about, username } = req.body;
        let fullName = `${firstname} ${lastname}`;
        
     
        let user = await User.findByIdAndUpdate(req.params.id, { fullName, username, about }, { new: true });

        // Re-authenticate the user if the username is changed
        if (req.user.username !== username) {
                req.login(user, (err) => {
                    if (err) return next(err);
                    res.redirect(`/users/${req.params.id}/profile`);
                });
           
        } else {
            res.redirect(`/users/${req.params.id}/profile`);
        }
    } catch (err) {
        next(new ExpressError(500, err.message));
    }
};

module.exports.follow=async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user._id;

        let user = await User.findById(id);
        let curuser = await User.findById(userId);
      
        if(id===userId)
            return  new ExpressError(500,'You cannot follow yourself')

        // Check if already following
        if (!user.followers.includes(userId)) {
            user.followers.push(userId);
        }
        if (!curuser.following.includes(id)) {
            curuser.following.push(id);
        }

        await curuser.save();
        await user.save();
        
        req.flash('success','Followed! There created pins will show in your feed')
        res.redirect('back');
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).send('Server Error');
    }
};

module.exports.unFollow= async (req, res) => {
    try {
        const id = req.params.id;
        
        // Retrieve both users from the database
        const user = await User.findById(id);
        const curuser = await User.findById(req.user._id);

        if (!user || !curuser) {
            return res.status(404).send('User not found');
        }
        // Convert IDs to strings for comparison
        const userIdStr = req.user._id.toString();
        const targetIdStr = id.toString();

        // Remove the current user from the user's followers list
        user.followers = user.followers.filter(follower => follower.toString() !== userIdStr);

        // Remove the target user from the current user's following list
        curuser.following = curuser.following.filter(following => following.toString() !== targetIdStr);

        // Save the changes to both users
        await user.save();
        await curuser.save();

        // Redirect back to the previous page
        res.redirect('back');
    } catch (error) {
        console.error('Error unfollowing user:', error);
        res.status(500).send('Internal server error');
    }
}