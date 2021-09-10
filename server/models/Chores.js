const { Schema } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const choreSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 80
    },
    instructions: {
      type: String,
      required: true,
      maxlength: 280
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: timestamp => dateFormat(timestamp)
    },
    isDone: {
      type: Boolean,
      default: false
    },
    value: {
      type: Number,
      required: true,
    }
  },
  {
    toJSON: {
      getters: true
    }
  }
);

module.exports = choreSchema;
