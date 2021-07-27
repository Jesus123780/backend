'use strict'

const { ApolloError } = require('apollo-server-errors')
const { Op } = require('sequelize')
const AreasModel = require('../../../models/featuresProducts/AreasModel')
const RequirementsModel = require('../../../models/requirements/RequirementsModel')
const {
    getAttributes,
    deCode,
    filterKeyObject,
    linkBelongsTo
} = require('../../../utils')

// Queries
const requirementQueries = {
    requirements: async (_root, { rState, aId, cId }, _context, info) => {
        try {
            linkBelongsTo(RequirementsModel, AreasModel, 'aId', 'aId')

            const attributes = getAttributes(RequirementsModel, info) || []
            const data = await RequirementsModel.findAll({
                attributes,
                include: [
                    {
                        attributes: ['cId'],
                        model: AreasModel,
                        required: true,
                        where: { cId: cId ? deCode(cId) : { [Op.gt]: 0 } }
                    }
                ],
                where: {
                    aId: aId ? deCode(aId) : { [Op.gt]: 0 },
                    rState: rState ? rState : { [Op.gt]: 0 }
                }
            })

            return data
        } catch (e) {
            return e
        }
    }
}

// Mutations
const requirementMutations = {
    createRequirement: async (_root, { input }) => {
        try {
            if (input.rId) {
                await RequirementsModel.update(
                    { ...filterKeyObject(input, ['rId']) },
                    { where: { rId: deCode(input.rId) } }
                )
                return { ...input }
            }

            const data = await RequirementsModel.create({
                rState: 1,
                rPriority: 1,
                ...input
            })
            return { rState: 1, ...input, rId: data.rId }
        } catch (err) {
            throw new ApolloError('Lo sentimos, ha ocurrido un error interno')
        }
    }
}

// Types
const requirementTypes = {
    Requirement: {
        area: async ({ aId }, _args, _context, info) => {
            try {
                const attributes = getAttributes(AreasModel, info) || []
                const data = await AreasModel.findOne({
                    attributes,
                    where: { aState: { [Op.gt]: 0 }, aId: deCode(aId) }
                })
                return data
            } catch (e) {
                return new ApolloError('Lo sentimos, ha ocurrido un error interno.')
            }
        }
    }
}

module.exports = {
    requirementQueries,
    requirementMutations,
    requirementTypes
}