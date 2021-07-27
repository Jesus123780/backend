'use strict'

const { ApolloError } = require('apollo-server-errors')
const { Op } = require('sequelize')
const GeneralFoldersModel = require('../../../models/generalFolders/GeneralFoldersModel')
const GeneralFoldersParentsModel = require('../../../models/generalFolders/GeneralFoldersParentsModel')
const { getAttributes, deCode } = require('../../../utils')

// Queries
const generalFolderParentsQueries = {
    generalFolderParents: async (root, { id }, context, info) => {
        try {
            const attributes = getAttributes(GeneralFoldersParentsModel, info) || []
            const data = await GeneralFoldersParentsModel.findAll({
                attributes,
                where: { parentId: id ? deCode(id) : { [Op.gte]: 0 } }
            })
            return data
        } catch (e) {
            return e
        }
    }
}

// Mutations
const generalFolderParentsMutations = {
    createGeneralFolderParent: async (_root, { input }) => {
        try {
            const { cId, aId, parentId, gfLevel, gfName } = input
            const dataFolder = await GeneralFoldersModel.create({ cId, aId, gfName, gfState: 1, gfLevel })
            const data = await GeneralFoldersParentsModel.create({ gfId: dataFolder.gfId, parentId, gfpLevel: gfLevel, gfpState: 1 })

            return { gfpId: data.gfpId, gfId: dataFolder.gfId, parentId, gfpLevel: gfLevel, gfpState: 1 }
        } catch (e) {
            throw new ApolloError('Lo sentimos, ha ocurrido un error interno.')
        }
    }
}

// Types
const generalFolderParentsTypes = {
    GeneralFolderParent: {
        folder: async ({ gfId }) => {
            try {
                const data = await GeneralFoldersModel.findOne({
                    where: { gfId: gfId ? deCode(gfId) : { [Op.gte]: 0 } }
                })
                return data
            } catch (e) {
                return null
            }
        }
    }
}

module.exports = {
    generalFolderParentsQueries,
    generalFolderParentsMutations,
    generalFolderParentsTypes
}