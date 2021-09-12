'use strict'

const { ApolloError } = require('apollo-server-errors')
const MessagesModel = require('../../../models/Messages/messages')
const Users = require('../../../models/UsersLogin/Users')
const { PubSub } = require('apollo-server')
const { Op } = require('sequelize')
const pubSub = new PubSub()
// Queries
const MessagesQueries = {
    getMessages: async (parent, { from }, ctx) => {
        try {
            if (!ctx.User.uUsername) throw new Error('Debes iniciar sesion primero')
            const otherUser = await Users.findOne({ attributes: ['id', 'username'], where: { username: from } })
            if (!otherUser) throw new Error('Usuario no existe')
            const usernames = [ctx.User.uUsername, otherUser.username]
            const messages = await MessagesModel.findAll({
                where: {
                    from: { [Op.in]: usernames },
                    to: { [Op.in]: usernames }
                },
                order: [['aDatCre', 'ASC']]
            })
            return messages
        } catch (e) {
            return e
        }
    }
}
// Mutations Para mensajes
const MessagesMutations = {
    sendMessage: async (parent, { to, content }, ctx) => {
        try {
            const messages = await MessagesModel.create({ from: ctx.User.uUsername, to, content, })
            pubSub.publish('NEW_MESSAGE', { newMessage: messages })
            return messages
        } catch (err) {
            throw new ApolloError('Lo sentimos, ha ocurrido un error interno')
        }
    }
}

// Types
const SubscriptionSubscription = {
    newMessage: {
        subscribe: () => pubSub.asyncIterator(['NEW_MESSAGE'])
    }
}
module.exports = {
    MessagesMutations,
    MessagesQueries,
    SubscriptionSubscription,
}