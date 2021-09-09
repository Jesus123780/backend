'use strict'
const { getAttributes } = require('../../../utils')
const { ApolloError } = require('apollo-server')
const UserMasters = require('../../../models/userMaster/userMasterModel')

// Queries
const userMasterQueries = {
    userMaster: async (root, { umSeCredential }, context, info) => {
        try {
            const attributes = getAttributes(UserMasters, info)
            const data = UserMasters.findOne({
                attributes,
                where: { umSeCredential }
            })
            return data
        } catch (e) {
            const error = new ApolloError('Lo sentimos, ha ocurrido un error interno', 400)
            return error
        }
    }
}
const RegisterUserMaster = {
    createUserMaster: async (_root, { input }, context, info) => {
        console.log(input)
    }
}
module.exports = {
    userMasterQueries,
    // loginMasterMutation,
    RegisterUserMaster,
}