const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name field is required'],
  },
  email: {
    type: String,
    required: [true, 'please provide your email'],
    unique: [true, 'email already used'],
    lowercase: true,
    validate: [validator.isEmail, 'please provide a valid email'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['co-admin', 'admin'],
    default: 'co-admin',
  },
  password: {
    type: String,
    required: [true, 'please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please confirm your password'],
    validate: {
      // thiss only owrking on save and create
      validator: function (el) {
        return el === this.password;
      },
      message: 'password are not the same',
    },
  },
  passwordChangedAt: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  // jika tidak ada perubahan password, yg mana artinya.
  // tidak membuat password baru. maka lanjut, tidak usah hash password
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined; //kita telah memvalidasi sebelumnya di schema diatas, dengan membuat validator
  // kita sudah tidak lagi memerlukan passwordConfirm laginext
  next();
});
userSchema.pre('save', function (next) {
  // jika password tidak berubah atau dokumen baru dibuat, tidak usah jalankan lanjutan / return next()
  if (!this.isModified('password') || this.isNew) return next();

  // supaya dibuat tidak berbarengan dengan jwt
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  inputPassword,
  userPassword
) {
  return await bcrypt.compare(inputPassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (jwtTime) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return jwtTime < changedTimeStamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
