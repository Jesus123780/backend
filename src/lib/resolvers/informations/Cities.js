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
// Queries
const citiesQueriesAll = {
    getCities: async (_root, _args, _context, info) => {
        try {
            const attributes = getAttributes(CitiesModel, info)
            const data = await CitiesModel.findAll({ attributes, where: { cState: { [Op.gt]: 0 } }, order: [['cName', 'DESC']] })
            return data
        } catch (e) {
            throw ApolloError('Lo sentimos, ha ocurrido un error interno')
        }
    }
}
// Mutations
const citiesMutation = {
    createCity: async (_root, { input }) => {
        const { cName, dId } = input
        try {
            const data = await CitiesModel.create({ cName, dId: deCode(dId), cState: 1 })
            return data
        } catch (e) {
            throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)
        }
    }
}

module.exports = {
    citiesQueries,
    citiesQueriesAll,
    citiesMutation,
}