import User from '../models/user.model.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


export const getUsers = async(req, res, next) => {
    try{
      const users = await User.find();

      res.status(200).json({ success: true, data: users})
    } catch(error){
        next(error)
    }

}

export const getUser = async(req, res, next) => {
    try{
     const user = await User.findById(req.params.id).select('-password');

     if(!user){
        const error = new Error('User not Found');
        error.statusCode = 404;
        throw error;
     }

     res.status(200).json({success: true, data: user});

    } catch(error){
        next(error)
    }
}

export const createUser = async(req, res, next) => {
  try{
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({email});

    if(existingUser) throw new Error ('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({name, email, password: hashedPassword})

    res.status(200).json({
      success: true,
      message: 'User created successfully',
      data: newUser
    })

  } catch(error){
    next(error)
  }
}

export const updateUser = async(req, res, next) => {
  try{
   const { id } = req.params;

   if(!mongoose.Types.ObjectId.isValid(id)){
    const error = new Error("Invalid User Id");
    error.status = 400;
    throw error;
   }
   const updatedData = { ...req.body };

   if(updatedData.password){
    updatedData.password = await bcrypt.hash(updatedData.password, 10);
   }
   
   const updateUser = await User.findByIdAndUpdate(id, updatedData,{
    runValidators:true,
    new:true
   }).select('-password');

   if(!updateUser){
    const error = new Error('User not found')
    error.status = 404;
    throw error;
   }

   res.status(200).json({
    success: true, 
    message: 'User updated successfully',
    data: updateUser
  })


  } catch(error){
    next(error)
  }
}

export const deleteUser = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("Invalid user ID");
        error.statusCode = 400;
        throw error;
      }
  
      const deletedUser = await User.findByIdAndDelete(id);
  
      if (!deletedUser) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }
  
      res.status(200).json({ success: true, message: "User deleted" });

    } catch (error) {
      next(error);
    }
  };

