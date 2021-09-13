'use strict'

const { ApolloError, UserInputError, ForbiddenError } = require('apollo-server-errors')
const { Op } = require('sequelize')
const MessagesModel = require('../../../models/Messages/messages')
const ReactionsModel = require('../../../models/Reactions/Reactions')
const Users = require('../../../models/UsersLogin/Users')

// Mutations
const reactionMutations = {
    reactToMessage: async (_, { uuid, content }, ctx) => {
        try {
            // Validate reaction-.ñ
            const reactions = ['😍', '❤️', '😲', '😡', '👍', '👎']
            if (!reactions.includes(content)) {
                throw new UserInputError('Reaction invalida')
            }
            // Get user
            const username = ctx.User.uUsername
            ctx.User.uUsername = await Users.findOne({ where: { username } })
            // Get user
            const message = await MessagesModel.findOne({ where: { uuid } })
            // if (message.from !== ctx.User.uUsername || message.to !== ctx.User.uUsername) {
            //     throw new ForbiddenError('No autorizado')
            // }
            const reaction = await ReactionsModel.findOne({
                where: { messageId: message.id, userId: ctx.User.id }
            })
            if (reaction) {
                reaction.content = reaction
                await reaction.save()
            } else {
                // Si la reaction no existe creala
                console.log('message.id')
                reaction = await ReactionsModel.create({
                    messageId: message.id,
                    userId: ctx.User.id,
                    content
                })
            }
            return reaction
        } catch (err) {
            throw new ApolloError('Lo sentimos, ha ocurrido un error interno')
        }
    }
}

module.exports = {
    reactionMutations,
}