'use strict'

const { ApolloError } = require('apollo-server')
const { Op } = require('sequelize')
const CitiesModel = require('../../../models/information/CitiesModel')
const { getAttributes, deCode } = require('../../../utils')

// Queries
const citiesQueries = {
    cities: async (_root, { dId }, _context, info) => {
        try {
            const attributes = getAttributes(CitiesModel, info)
            const data = await CitiesModel.findAll({ attributes, where: { dId: deCode(dId), cState: { [Op.gt]: 0 } }, order: [['cName', 'ASC']] })
            return data
        } catch (e) {
            throw new ApolloError('Lo sentimos, ha ocurrido un error interno')
        }
    }
}

module.exports = {
    citiesQueries
}