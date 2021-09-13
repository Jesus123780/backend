'use strict'

const { ApolloError } = require('apollo-server-errors')
const FollowModel = require('../../../models/Follow/Follow')
const Users = require('../../../models/UsersLogin/Users')
const { deCode } = require('../../../utils')

// Mutations
const followMutations = {
    followUser: async (_root, args, ctx) => {
        const { username } = args
        try {
            const UserFound = await Users.findOne({ attributes: ['id', 'username', 'email'], where: { username } })
            if (!UserFound) throw new Error(`El usuario '${username}' no existe`)
            const follow = new FollowModel({
                id: ctx.User.id ? deCode(ctx.User.id) : null,
                follow: UserFound.id ? deCode(UserFound.id) : null,
                fState: 1
            });
            follow.save()
            return true
        } catch (err) {
            // eslint-disable-next-line
            console.log(err)
            return false
        }
    },
    unFollow: async (_root, args, ctx) => {
        const { username } = args
        try {
            const UserFound = await Users.findOne({ attributes: ['id', 'username', 'email'], where: { username } })
            if (!UserFound) throw new Error(`El usuario '${ username }' no existe`)
            const follow = await FollowModel.destroy({ id: deCode(ctx.User.id) })
                .where('follow')
                .equals(UserFound.id)
            if (follow.length > 0) {
                return true
            } else {
                return false
            }
        } catch (err) {
            // eslint-disable-next-line
            console.log(err)
            return false
        }
    }
}
const followQuery = {
    isFollow: async (_root, { username }, ctx) => {
        try {
            const UserFound = await Users.findOne({ attributes: ['id', 'username', 'email'], where: { username } })
            if (!UserFound) false
            const follow = await FollowModel.findOne({ id: deCode(ctx.User.id) })
            if (follow.length > 0) {
                return console.log('dio true')
            } else {
                return console.log('dio false')
            }
        } catch (err) {
            throw new ApolloError('No ha sido posible procesar su solicitud.', 500)
        }
    }
}

module.exports = {
    followMutations,
    followQuery,
}