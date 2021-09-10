const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const parentSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must match an email address!']
    },
    password: {
      type: String,
      required: true,
      minlength: 5
    },
    
    children: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Child'
      }
    ]
  },
  {
    toJSON: {
      virtuals: true
    }
  }
);

// set up pre-save middleware to create password
parentSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// compare the incoming password with the hashed password
parentSchema.methods.isCorrectPassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

parentSchema.virtual('childCount').get(function() {
  return this.children.length;
});

const Parent = model('Parent', parentSchema);

module.exports = Parent;
