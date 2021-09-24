const { AuthenticationError } = require('apollo-server-express');
const { Parent, Child } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {

    me: async (parentArg, args, context) => {
      if (context.parent) {
        const parentData = await Parent.findOne({ _id: context.parent._id })
          .select('-__v -password')
          .populate('children');

        return parentData;
      }

      throw new AuthenticationError('Not logged in');
    },
    parents: async () => {
      return Parent.find()
        .select('-__v -password')
        .populate('children');
    },
    parent: async (parentArg, { username }) => {
      return Parent.findOne({ username })
        .select('-__v -password')
        .populate('children');
    },
    children: async (parentArg, { username }) => {
      const params = username ? { username } : {};
      return Child.find(params)
      .select('-__v -passcode')
      .sort({ dateOfBirth: -1 });
    },
    child: async (parentArg, { _id }) => {
      return Child.findOne({ _id })
      .populate('chores')
      .sort({createdAt: -1});
    }
  },

  Mutation: {
    addParent: async (parentArg, args) => {
      const parent = await Parent.create(args);
      const token = signToken(parent);

      return { token, parent };
    },
    login: async (parentArg, { email, password }) => {
      const parent = await Parent.findOne({ email });

      if (!parent) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await parent.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(parent);
      return { token, parent };
    },
    loginChild: async (parentArg, { parentUsername, childName, passcode }) => {
      const child = await Child.findOne({ parentUsername, childName });

      if (!child) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await child.isCorrectPassword(passcode);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(child);
      return { token, child };
    },
    addChild: async (parentArg, args, context) => {
      if (context.parent) {
        const child = await Child.create({ ...args, parentUsername: context.parent.username });
        await Parent.findByIdAndUpdate(
          { _id: context.parent._id },
          { $push: { children: child._id } },
          { new: true }
        );
         console.log(child) ;
        return child;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    addChore: async (parent, { childId, title, instructions, value }, context) => {
      if (context.parent) {
        const updatedChild = await Child.findOneAndUpdate(
          { _id: childId },
          { $push: { chores: { title, instructions, createdBy: context.parent.username , value} } },
          { new: true, runValidators: true }
        );

        return updatedChild;
      }

      throw new AuthenticationError('You need to be logged in!');
    }
  }
};

module.exports = resolvers;