'use strict'

const { ApolloError } = require('apollo-server')
const SubModulesModel = require('../../../models/subModules/SubModulesModel')
const UserPermitsModel = require('../../../models/userPermits/UserPermitsModel')
const { getAttributes } = require('../../../utils')

// Queries
const subModuleQueries = {
    subModules: async (root, args, context, info) => {
        try {
            const attributes = getAttributes(SubModulesModel, info)
            const data = SubModulesModel.findAll({ attributes })
            return data
        } catch (e) {
            const error = new Error('Lo sentimos, ha ocurrido un error interno')
            return error
        }
    }
}

// Mutations
const subModuleMutations = {
    createSubModule: async (root, { input }) => {
        try {
            const data = await SubModulesModel.create({ ...input, smState: 1 })
            return { ...input, smId: data.smId }
        } catch (e) {
            const error = new Error('Lo sentimos, ha ocurrido un error interno')
            return error
        }
    }
}

// Types
const subModuleTypes = {
    SubModule: {
        userPermits: async ({ smId }, _args, _context, info) => {
            const { upState, uId } = info?.variableValues?.data || {}
            try {
                const data = await UserPermitsModel.findAll({ attributes: ['upId', 'uId', 'smId', 'upState'], where: { smId: deCode(smId), upState, uId: decode(uId) } })
                return data
            } catch (e) {
                const error = new ApolloError('Lo sentimos, ha ocurrido un error interno', 400)
                return error
            }
        }
    }
}

module.exports = {
    subModuleQueries,
    subModuleMutations,
    subModuleTypes
}