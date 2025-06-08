import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
        name: {
          type: String, 
          required: [true, 'User name is required'],
          trim: true,
          minLenght: 2,
          maxLenght: 50,
        },
        email: {
            type: String, 
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/\S+@\S+\.\S+/, 'Please fill with a valid email address'],
        },
        password:{
            type: String,
            required: [true, 'User Password is required'],
            minLenght: 6,
        }
    }, {timestamps: true});

    const User = mongoose.model('User', userSchema);

    export default User;