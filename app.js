require('dotenv').config();
const express=require('express');
const app=express();
const mongoose=require('mongoose');
const session=require('express-session');
const User = require('./models/userModel');
const path=require('path');
const mongoStore=require('connect-mongo');
const ejsmate=require('ejs-mate');
const cookieParser=require('cookie-parser')
const LocalStrategy=require('passport-local');
const passport=require('passport');
const flash=require('connect-flash');


const userRouter=require('./routes/userRoute.js');
const pinsRouter=require('./routes/pinsRoute.js');
const boardsRouter=require('./routes/boardsRoute.js');


const methodOverride=require('method-override');
const { isLoggedIn } = require('./middleware.js');
app.use(methodOverride('_method'));

const dbUrl=process.env.AT;
async function main(){
 await mongoose.connect(dbUrl);
}

main().then((res)=>{
    console.log('Connected to db');
});

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.engine('ejs',ejsmate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));



const store=mongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret: process.env.SESSION_SECRET
    },
    touchAfter:24*3600,
});
app.use(cookieParser());
const sessionOptions={
    store:store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now() +7*24*60*60*1000, 
        maxAge:7*24*60*60*1000, 
        httpOnly:true,
        secure:false,
    },
}
app.use(session(sessionOptions))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 


app.use(flash());

app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currUser=req.user;
    next();
})

app.get('/',async(req,res)=>{
    if(req.user){
        return res.redirect('/pins');
    }
    res.render('signup');
});

app.use('/users',userRouter);
app.use('/pins', isLoggedIn, pinsRouter);
app.use('/boards',isLoggedIn, boardsRouter);

app.listen(8080,()=>{
    console.log('app is listining');
});

app.use((err,req,res,next)=>{
    let {status=500,message='Error is occured'}=err;
    console.log(err);
    res.render('error.ejs',{status, message });
});