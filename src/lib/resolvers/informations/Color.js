'use strict'

const { ApolloError } = require('apollo-server')
const { Op } = require('sequelize')
const colorModel = require('../../../models/products/color')
const { getAttributes, deCode } = require('../../../utils')

// Queries
const colorQueries = {
    getAllColor: async (_root, { colorId }, _context, info) => {
        try {
            const attributes = getAttributes(colorModel, info)
            const data = await colorModel.findAll({
                attributes,
                where: {
                    [Op.or]: [
                        {
                            colorId: colorId ? deCode(colorId) : { [Op.gt]: 0 },
                        }
                    ]
                }
            })
            return data
        } catch (e) {
            throw new ApolloError('Lo sentimos, ha ocurrido un error interno')
        }
    }
}
// Mutation
// Mutations
const colorMutation = {
    createColor: async (_root, { input }) => {
        try {
            const res = await colorModel.create({ ...input })
            return res
        } catch (e) {
            throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)
        }
    }
}

module.exports = {
    colorQueries,
    colorMutation,
}