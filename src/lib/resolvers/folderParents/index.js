'use strict'

const { Op } = require('sequelize')
const FoldersModel = require('../../../models/folders/FoldersModel')
const FoldersParentModel = require('../../../models/folders/FoldersParentModel')
const { getAttributes, deCode } = require('../../../utils')

// Queries
const folderParentsQueries = {
    // Queries
    foldersParents: async (root, { id }, context, info) => {
        try {
            const attributes = getAttributes(FoldersParentModel, info) || []
            const data = await FoldersParentModel.findAll({ attributes, where: { parentId: id ? deCode(id) : { [Op.gte]: 0 } } })
            return data
        } catch (e) {
            return e
        }
    },

}

// Mutations
const folderParentsMutation = {
    setFolderParent: async (root, { input }) => {
        try {
            const { uId, parentId, fpLevel, fName } = input
            const dataFolder = await FoldersModel.create({ uId, fName, fState: 1, fLevel: fpLevel })
            const data = await FoldersParentModel.create({ fId: dataFolder.fId, parentId: parentId, fpLevel, fpState: 1 })

            return { fpId: data.fpId, parentId, fpLevel, folder: { fId: dataFolder.fId, fName, uId, fLevel: fpLevel } }
        } catch(e) {
            return e
        }
    }
}

// Types
const foldersParentTypes = {
    FolderParent: {
        folder: async ({ fId }) => {
            try {
                const data = await FoldersModel.findOne({ where: { fId: fId ? deCode(fId) : {[Op.gte]: 0} } })
                return data
            } catch(e) {
                return e
            }
        }
    }
}
module.exports = {
    folderParentsQueries,
    folderParentsMutation,
    foldersParentTypes
}