'use strict'

const { Op } = require('sequelize')
const trademarkModel = require('../../../models/Products/trademark')
const { getAttributes, deCode } = require('../../../utils')

// Queries
const trademarkQueries = {
    // Queries
    trademarkAll: async (root, { tId }, context, info) => {
        try {
            const attributes = getAttributes(trademarkModel, info) || []
            const data = await trademarkModel.findAll({ attributes, where: { tId: tId ? deCode(tId) : { [Op.gte]: 0 } } })
            return data
        } catch (e) {
            return e
        }
    },

}

module.exports = {
    trademarkQueries,
}