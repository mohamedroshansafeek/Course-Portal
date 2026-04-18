const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'instructor', 'student'], 
    default: 'student',
    required: true
  }
}, { timestamps: true });

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password; // Important: do not return password hash
  }
});

module.exports = mongoose.model('User', userSchema);
