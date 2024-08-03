const express = require('express');
const bodyparser = require('body-parser')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const mongoose = require('mongoose')
const secretkey = "mukundjha";

const app = express()
app.use(express.json())


const adminSchema = new mongoose.Schema({
    username:{
        type:String
    },
    password:{
        type:String
    }
});

const userSchema = new mongoose.Schema({
    username:{
        type:String},
    password:{type:String}
    

})

const Courceschema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    published:{
      type:Boolean,
      default: false,
      required: true,
    }

})

const User = mongoose.model('Users', userSchema);
const Admin = mongoose.model('Admins',adminSchema);
const Cources = mongoose.model('Cources',Courceschema);


var counter = 0;



const uri ="mongodb+srv://jhamukund986:Mukund%402003@mukund.qmjqwkk.mongodb.net/Cource-selling";

mongoose.connect(uri,{
  

}).then(function(sucess)
{
  console.log("sucessfully connected:")
}).catch(function(error)
{
  console.log('usucessfully connected:',error);
})


app.post('/admins/signup',async function(req,res)
{
    const{username,password} = req.body;

    try{
      const exits = await Admin.findOne({username:username,password:password})
       if(exits)
       {
         res.status(404).json({msg:"Admins already exists:"})
       }
       const admin = new Admin({username,password});
       await admin.save(admin);
        res.status(201).json({msg:"admin signup sucessfully:"})
      }
    catch(error){
            res.status(404).json({msg:`internal server issues:${error}`});
    }
    
})


 app.post('/Admins/login',async function(req,res)
 {
   const{username,password} = req.body;
   try{
   const exits = await Admin.findOne({username,password});
   if(exits)
   {
    const token = jwt.sign({username},secretkey,{expiresIn:"1hr"});
     res.json({msg:"Logins sucessfully:",token:token});
   }
   else{
    res.status(404).json({msg:"invalid username and password"});
   }
  }
  catch(error)
  {
     console.log(`internal server issues:${error}`)
  }
 })

 app.post('/admin/cources',async function(req,res)
{
  try{
  const{title,description,price,published} = req.body;
  const cources1 = new Cources({
     title:title,
     description:description,
     price: price,
     published :published,
 
     
  })
  
  await cources1.save();
  res.status(200).json({status:"cources added sucessfully",cource:Cources});
}
catch(error)
{
  console.log(`internal server error:${error}`)
}
})

// updating the admins/cource->>>

app.put('/admin/cources/:_id', async (req, res) => {
  const { _id } = req.params;
  const { title, description, price ,} = req.body; 
  try {
   
    const updatedCourse = await Cources.findByIdAndUpdate(
      _id, 
      { $set: { title, description, price } },
      { new: true, runValidators: true } 
    );

    if (updatedCourse) {
      
      res.status(200).json({ msg: 'Course updated successfully', course: updatedCourse });
    } else {
      
      res.status(404).json({ msg: 'Course not found' });
    }
  } catch (error) {
    console.error(`Internal server issue: ${error.message}`);
  
  }
});
// user signup ->

app.post('/users/signup',async function(req,res)
{
  try{
     const {username,password} = req.body;
     const exits = await User.findOne({username: username,password:password});
     if(exits)
     {
       res.status(404).json({msg:"users already exits:"});
     }
    
     const users = new User({username,password});
     await users.save();
    
     const token = jwt.sign({username,model:"user"},secretkey,{expiresIn:"1hr"});

     res.status(200).json({user:"signup sucessfully!",token:token});
  }
  catch(error)
  {
    console.log(`internal issues:${error}`);
  }

})

app.post('/users/login',async function(req,res)
{
  try{
  const{username,password} = req.body;
  const data = await User.findOne({username:username,password:password});
  if(!data)
  {
    res.status(404).json({msg:"users not exits:"})
  }
   const token = jwt.sign({username,model:"user"},secretkey,{expiresIn:"1hr"});
  res.status(200).json({status:"Login sucessfully!",token:token})
}
catch(error)
{
  console.log(`internal error:${error}`);
}
})

app.get('/users/courses1', async (req, res) => {
  const courses = await Cources.find({published: true});
  res.json({ courses });
});


let port = 3000

app.listen(port,()=>{
console.log(`listening on port: ${port}`)
});

