const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const adminModel = new Schema({
    username:{type: String,unique:true,lowercase:true},
    password: String
})
adminModel.pre('save',function(next){
  const admin = this;

  bcrypt.genSalt(10,function(err,salt){
    if(err) return next(err);
    bcrypt.hash(admin.password,salt,null,function(err,hash){
      if(err) return next(err)
      admin.password = hash;
      next();
    })
  })
 })
adminModel.methods.comparePassword = function(password){
    return bcrypt.compareSync(password,this.password);
    //Return either True or False
}

module.exports = mongoose.model('Admin',adminModel);
