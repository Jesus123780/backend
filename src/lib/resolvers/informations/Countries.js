'use strict'

const { ApolloError } = require('apollo-server')
const { Op } = require('sequelize')
const CountriesModel = require('../../../models/information/CountriesModel')
const ProductsModel = require('../../../models/Products/Products')
const { getAttributes, deCode } = require('../../../utils')

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

// Types
const countriesTypes = {
    Country: {
        client: async (parent, _args, _context, info) => {
            try {
                const attributes = getAttributes(ProductsModel, info)
                const data = await ProductsModel.findOne({ attributes, where: { pId: deCode(parent.pId) } })
                return data
            } catch { return null }
        },
    }
}
module.exports = {
    countriesQueries,
    countriesTypes,
}