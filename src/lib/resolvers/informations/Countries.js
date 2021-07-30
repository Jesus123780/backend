'use strict'

const { ApolloError } = require('apollo-server')
const { Op } = require('sequelize')
const CountriesModel = require('../../../models/information/CountriesModel')
const { getAttributes } = require('../../../utils')

// Queries
const countriesQueries = {
    countries: async (_root, _args, _context, info) => {
        try {
            const attributes = getAttributes(CountriesModel, info)
            const data = await CountriesModel.findAll({ attributes, where: { cState: { [Op.gt]: 0 } } })
            return data
        } catch (e) {
            throw ApolloError('Lo sentimos, ha ocurrido un error interno')
        }
    }
}

// Mutations
const countriesMutation = {
    createCountry: async (_root, { input }) => {
        // eslint-disable-next-line
        console.log('object')
        try {
            const data = await CountriesModel.create({ ...input, cState: 1 })
            return data
        } catch (e) {
            throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)
        }
    }
}
module.exports = {
    countriesQueries,
    countriesMutation,
}