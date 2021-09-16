const { Schema, model } = require('mongoose');
const choreSchema = require('./Chore');
const dateFormat = require('../utils/dateFormat');

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
    parent: {
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

childSchema.virtual('choreCount').get(function() {
  return this.chores.length;
});

const Child = model('Child', childSchema);

module.exports = Child;
