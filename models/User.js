const mongoose = require('mongoose')
const md5 = require('md5')
const bcrypt = require('bcryptjs')

let UserSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    avatar: {
      type: String
    },
    joinDate: {
      type: Date,
      default: Date.now
    },
    favorites: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      ref: 'Post'
    }
});

UserSchema.pre('save', function(next) {
  this.avatar = `http://gravatar.com/avatar/${md5(this.username)}?=identicon`
  next()
})

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next()
  }
  const salt = await bcrypt.genSaltSync(10);
  const hash = await bcrypt.hashSync(this.password, salt);
  this.password = hash
  next()
  // bcrypt.genSalt(10, (err, salt) => {
  //   if (err) return next(err);

  //   bcrypt.hash(this.password, salt, (err, hash) => {
  //     if (err) return next(err)

  //     this.password = hash
  //     next()
  //   })
  // })
})

module.exports = mongoose.model('User', UserSchema );