const { Schema, model } = require('mongoose');
const choreSchema = require('./Chore');
const dateFormat = require('../utils/dateFormat');
const bcrypt = require('bcrypt');

const childSchema = new Schema(
  {
    childName: {
      type: String,
      required: 'We need a name here!',
      minlength: 1
    },
    dateOfBirth: {
      type: Date,
      default: Date.now,
      get: timestamp => dateFormat(timestamp)
    },
    parentUsername: {
      type: String,
      required: true
    },
    passcode: {
      type: String,
      required: "You have to set a passcode for your child!",
      minlength: 5,
      maxlength: 8
    },
    chores: [choreSchema]
  },
  {
    toJSON: {
      getters: true
    }
  }
);
childSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('passcode')) {
    const saltRounds = 10;
    this.passcode = await bcrypt.hash(this.passcode, saltRounds);
  }

  next();
});

// compare the incoming password with the hashed password
childSchema.methods.isCorrectPassword = async function(passcode) {
  return bcrypt.compare(passcode, this.passcode);
};

childSchema.virtual('choreCount').get(function() {
  return this.chores.length;
});

const Child = model('Child', childSchema);

module.exports = Child;
