'use strict'

const { ApolloError } = require('apollo-server-errors')
const { Op } = require('sequelize')
const AreasModel = require('../../../models/areas/AreasModel')
const ProductsModel = require('../../../models/product/product')
const EmployeesModel = require('../../../models/employees/EmployeesModel')
const ThirdPartiesModel = require('../../../models/thirdParties/ThirdPartiesModel')
const { getAttributes, deCode, filterKeyObject, linkBelongsTo } = require('../../../utils')

// Queries
const areasQueries = {
    areas: async (root, { aState, umId, pId }, context, info) => {
        linkBelongsTo(AreasModel, ProductsModel, 'pId', 'pId')
        linkBelongsTo(ProductsModel, ThirdPartiesModel, 'tpId', 'tpId')
        try {
            const attributes = getAttributes(AreasModel, info) || []
            const data = await AreasModel.findAll({ attributes,
                include: [
                    { attributes: ['pId'],
                        model: ProductsModel,
                        required: true,
                        include: [{
                            attributes:['tpId'],
                            model: ThirdPartiesModel, where: { umId: deCode(umId) }, required: true
                        }]
                    }
                ],
                where: { pId: pId ? deCode(pId) : { [Op.gt]: 0 }, aState: aState ? aState : { [Op.gt]:  0 } }
            })
            return data
        } catch (e) {
            return e
        }
    }
}

// Mutations
const areasMutations = {
    createArea: async (_root, { input }) => {
        try {
            if (input.aId) {
                await AreasModel.update({ ...filterKeyObject(input, ['aId']) }, { where: { aId: deCode(input.aId) } })
                return { ...input }
            }

            const data = await AreasModel.create({ aState: 1, ...input })
            return { aState: 1, ...input, aId: data.aId }
        } catch (err) {
            throw new ApolloError('Lo sentimos, ha ocurrido un error interno')
        }
    }
}

// Types
const areasTypes = {
    Area: {
        client: async (parent, _args, _context, info) => {
            try {
                const attributes = getAttributes(ProductsModel, info)
                const data = await ProductsModel.findOne({ attributes, where: { pId: deCode(parent.pId) } })
                return data
            } catch { return null }
        },
        employees: async ({ aId }) => {
            try {
                const data = await EmployeesModel.findAll({ where: { aId: aId ? deCode(aId) : { [Op.gte]: 0 } } })
                return data
            } catch (e) {
                return e
            }
        }
    }
}

module.exports = {
    areasQueries,
    areasMutations,
    areasTypes
}