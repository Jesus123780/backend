'use strict'

const { ApolloError } = require('apollo-server-errors')
const MessagesModel = require('../../../models/Messages/messages')
const Users = require('../../../models/UsersLogin/Users')
const { withFilter } = require('apollo-server')
const { PubSub, AuthenticationError } = require('apollo-server')
const { Op } = require('sequelize')
const pubSub = new PubSub()
// Queries
const MessagesQueries = {
    Query: {
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
                return messages;
            } catch (e) {
                return e
            }
        }
    }
}
// Mutations Para mensajes
const MessagesMutations = {
    Mutation: {
        sendMessage: async (parent, { to, content }, ctx) => {
            try {
                const message = await MessagesModel.create({ from: ctx.User.uUsername, to, content, })
                pubSub.publish('NEW_MESSAGE', { newMessage: message })
                return message
            } catch (err) {
                throw new ApolloError('Lo sentimos, ha ocurrido un error interno')
            }
        }
    }
}

// Suscripcion para enviar mensajes
const SubscriptionSubscription = {
    Subscription: {
        newMessage: {
            subscribe:  withFilter((_, __, ctx) => {
                if (!ctx) throw new AuthenticationError('Unauthenticated')
                return pubSub.asyncIterator(['NEW_MESSAGE'])
            }, ({ newMessage }, _, ctx)=> {
                if (newMessage.from === ctx.User.uUsername || newMessage.to === ctx.User.uUsername) {
                    return true
                }
                return false
            }),
        },
    },
}
module.exports = {
    MessagesMutations,
    MessagesQueries,
    SubscriptionSubscription,
}