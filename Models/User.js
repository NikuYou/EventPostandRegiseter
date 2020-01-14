var mongoose              = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

// User Schema
var userSchema = mongoose.Schema({
  username: {
    type: String,
    index:true, // Index ensures property is unique in db.
    minlength: 5,
    required: true
  },
  password: {
    type: String
  },
  email: {
    type: String,
    required:true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 
                                'Please fill a valid email address']
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
      type: String,
      required: true
  },
  streetAddress: {
      type: String,
      required: true
  },
  phoneNumber: {
      type: String,
      required: true,
      match:[/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
                                'please fill a valid phone number']
  }
});
userSchema.plugin(passportLocalMongoose);
var User = module.exports = mongoose.model('User', userSchema);
module.exports = User;

