const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');
const controller = require('../controllers/user-controller')

const resolvers = {
    Query: {
        user: async (parent, { username }) => {
            return User.findOne({ username }).populate('books');
        },
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id }).populate('books');
            }
            throw new AuthenticationError('You need to be logged in!!');
        }
    },

    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const userResponse = await controller.createUser(username, email, password);
            return userResponse;
        },
        login: async (parent, { email, password }) => {
            const userLoginResponse = await controller.login(email, password);

            return userLoginResponse;
        },
        //add a book to a users saved books, return error if no user logged in
        saveBook: async (parent, { authors, description, bookId, image, link, title }) => {
            const bookToAdd = {
                authors, description, bookId, image, link, title
            }

            const userAddResponse = await controller.saveBook(context.user, bookToAdd);
           return userAddResponse;
        },
        removeBook: async (parent, { bookId }, context) => {
            const userDeleteResponse = await controller.deleteBook(context.user, bookId);
            return userDeleteResponse;
        }
    }
}

module.exports = resolvers;