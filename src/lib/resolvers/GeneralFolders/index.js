'use strict'

const { ApolloError } = require('apollo-server-errors')
const { Op } = require('sequelize')
const GeneralFoldersModel = require('../../../models/generalFolders/GeneralFoldersModel')
const { getAttributes, deCode, filterKeyObject } = require('../../../utils')

// Queries
const generalFoldersQueries = {
    generalFolders: async (_root, { cId, aId, gfState }, _context, info) => {
        try {
            const attributes = getAttributes(GeneralFoldersModel, info) || []
            const data = await GeneralFoldersModel.findAll({
                attributes,
                where: { gfState: gfState || 1, cId: deCode(cId), gfLevel: 1, aId: aId ? deCode(aId) : { [Op.gt]: 0 } }
            })
            return data
        } catch (e) {
            return e
        }
    }
}

//Mutations
const generalFoldersMutations = {
    createGeneralFolder: async (root, { input }) => {
        try {
            const { gfId } = input || {}
            if (gfId) {
                const values = filterKeyObject(input, ['gfId', '__typename'])
                await GeneralFoldersModel.update(
                    { ...values },
                    { where: { gfId: deCode(gfId) } }
                )
                return { ...input }
            } else {
                const data = await GeneralFoldersModel.create({
                    gfState: 1,
                    ...input
                })
                return { gfState: 1, ...input, gfId: data.gfId }
            }
        } catch (e) {
            throw new ApolloError(e.message)
        }
    }
}

module.exports = {
    generalFoldersQueries,
    generalFoldersMutations
}