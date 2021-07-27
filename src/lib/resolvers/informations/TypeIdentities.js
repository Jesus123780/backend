'use strict'

const { ApolloError } = require('apollo-server')
const { Op } = require('sequelize')
const TypeIdentitiesModel = require('../../../models/information/TypeIdentitiesModel')
const { getAttributes } = require('../../../utils')

// Queries
const typeIdentitiesQueries = {
    typeIdentities: async (_root, _args, _context, info) => {
        try {
            const attributes = getAttributes(TypeIdentitiesModel, info)
            const data = await TypeIdentitiesModel.findAll({ attributes, where: { tiState: { [Op.gt]: 0 } } })
            return data
        } catch (e) {
            throw new ApolloError('Lo sentimos, ha ocurrido un error interno')
        }
    }
}
// Mutation
const typeIdentitiesMutation = {
    createTypeIdentity: async (_root, { input }) => {
        console.log(input)
        try {
            const data = await TypeIdentitiesModel.create({ ...input })
            return data
        } catch (e) {
            throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)
        }
    }
}

module.exports = {
    typeIdentitiesQueries,
    typeIdentitiesMutation
}