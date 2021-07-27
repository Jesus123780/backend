'use strict'

const { ApolloError } = require('apollo-server-errors')
const { Op } = require('sequelize')
const EmployeesFoldersModel = require('../../../models/employees/EmployeesFoldersModel')
const EmployeesFoldersParentsModel = require('../../../models/employees/EmployeesFoldersParentsModel')
const { getAttributes, deCode } = require('../../../utils')

// Queries
const employeeFolderParentsQueries = {
    // Queries
    employeeFolderParents: async (root, { id }, context, info) => {
        try {
            const attributes = getAttributes(EmployeesFoldersParentsModel, info) || []
            const data = await EmployeesFoldersParentsModel.findAll({ attributes, where: { parentId: id ? deCode(id) : { [Op.gte]: 0 } } })
            return data
        } catch (e) {
            return e
        }
    },

}

// Mutations
const employeeFolderParentsMutations = {
    createEmployeeFolderParent: async (_root, { input }) => {
        try {
            const { eId, parentId, efLevel, efName, update } = input

            if (update) {
                const eFolder = await EmployeesFoldersParentsModel.findOne({ attributes: ['efpId', 'efId'] }, { where: { parentId } })
                await EmployeesFoldersModel.update({ efName }, { where: { efId: deCode(parentId) } })

                return { efpId: eFolder.efpId, efId: eFolder.efId, parentId, efpLevel: efLevel, efpState: 1 }
            }

            const dataFolder = await EmployeesFoldersModel.create({ eId, efName, efState: 1, efLevel })
            const data = await EmployeesFoldersParentsModel.create({ efId: dataFolder.efId, parentId, efpLevel: efLevel, efpState: 1 })

            return { efpId: data.efpId, efId: dataFolder.efId, parentId, efpLevel: efLevel, efpState: 1 }
        } catch (e) {
            throw new ApolloError('Lo sentimos, ha ocurrido un error interno.')
        }
    }
}

// Types
const employeeFolderParentsTypes = {
    EmployeeFolderParent: {
        folder: async ({ efId }) => {
            try {
                const data = await EmployeesFoldersModel.findOne({ where: { efId: efId ? deCode(efId) : { [Op.gte]: 0 } } })
                return data
            } catch (e) {
                return null
            }
        }
    }
}

module.exports = {
    employeeFolderParentsQueries,
    employeeFolderParentsMutations,
    employeeFolderParentsTypes
}