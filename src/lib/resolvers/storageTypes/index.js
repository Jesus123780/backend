'use strict'

const { Op } = require('sequelize')
const { ApolloError } = require('apollo-server')
const { getAttributes } = require('../../../utils')
const StorageTypesModel = require('../../../models/Storage/StorageTypesModel')

// Queries
const storageTypesQueries = {
    storageTypes: async (root, { state }, _context, info) => {
        try {
            const attributes = getAttributes(StorageTypesModel, info)
            const data = await StorageTypesModel.findAll({ attributes, where: { stState: { [Op.gt]: state ? state : 0 } } })
            return data
        } catch (e) {
            return new ApolloError('Lo sentimos, ha ocurrido un error interno.', 400)
        }
    }
}

module.exports = {
    storageTypesQueries,
}