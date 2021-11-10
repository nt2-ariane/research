const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    default: null
  },
  infos:
  {
    firstname: String,
    lastname: String
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: Date.now() },
},
{
  collection : 'users' 
},
);

// export model user with UserSchema
module.exports = mongoose.model("user", UserSchema);
