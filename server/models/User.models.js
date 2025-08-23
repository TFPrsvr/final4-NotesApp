const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {

        first: {
          type: String,
          required: true,
        },

        last: {
          type: String,
          required: true,
        },

        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
        },
        
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
        },

        password: {
            type: String,
            required: [true, 'Password is required'],
        },
         
          
    }
)
const User = mongoose.model("User", UserSchema);
module.exports = User;