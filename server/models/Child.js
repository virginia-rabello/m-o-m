const { Schema, model } = require('mongoose');
const choresSchema = require('./Chores');
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
    parents: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Parent'
        }
      ],
    chores: [choresSchema],
    passcode: {
      type: String,
      required: "You have to set a passcode for your child!",
      minlength: 5,
      maxlength: 8
    }
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

const child = model('child', childSchema);

module.exports = child;
