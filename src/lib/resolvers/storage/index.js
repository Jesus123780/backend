'use strict'

const { Op } = require("sequelize")
const { ApolloError } = require('apollo-server')
const StorageModel = require("../../../models/Storage/StorageModel")
const { getAttributes, deCode } = require("../../../utils")
const StorageTypesModel = require("../../../models/Storage/StorageTypesModel")

// Queries
const storageQueries = {
    storages: async (root, { umId, state }, _context, info) => {
        try {
            const attributes = getAttributes(StorageModel, info)
            const data = await StorageModel.findAll({ attributes, where: { sState: state || { [Op.gt]: 0 }, umId: deCode(umId) } })
            return data
        } catch (e) {
            return new ApolloError('Lo sentimos, ha ocurrido un error interno.', 400)
        }
    }
}

// Mutations
const storageMutations = {
    createStorage: async (_root, { input }) => {
        try {
            let data = {}
            if (input.sId) {
                const { sId, sName, sRegion, sState, stId, umId } = input
                await StorageModel.update({ sName, sRegion, sState, stId, umId }, { where: { sId: deCode(sId) } })
                data = { sId }
            }
            else
                data = await StorageModel.create({ sState: 2, ...input })

            return { sState: 1, ...input, sId: data.sId }
            
        } catch (e) {
            return new ApolloError('Lo sentimos, ha ocurrido un error interno.', 400)
        }
    },
    changeStateStorage: async(_root, { sState, sId, umId }) => {
        try {
            console.log(sState, sId, umId)
            if(sState === '1'){
                const storageActiveNow = await StorageModel.findOne({ attributes: ['sId', 'sState'], where: { sState: 1, umId: deCode(umId) } })
                !!storageActiveNow && await StorageModel.update({ sState: 2 }, { where: { sId: deCode(storageActiveNow.sId) }})
            }
            await StorageModel.update({ sState }, { where: { sId: deCode(sId) }})
            const res = await StorageModel.findOne({ attributes: ['sName', 'sRegion', 'stId' ] }, { where: { sId: deCode(sId) }})
            
            return { sState, sId, umId, sName: res.sName, sRegion: res.sRegion, stId: res.stId }
        }  catch (e) {
            throw new ApolloError('Lo sentimos, ha ocurrido un error interno.', 400)
        }
    }
}

// Types
const storageTypes = {
    Storage: {
        storageType: async ({ stId }) => {
            try {
                const data = await StorageTypesModel.findOne({ attributes: ['stName', 'stId'],  where: { stId: deCode(stId) } })
                return data
            } catch(e){
                throw new ApolloError('Lo sentimos, ha ocurrido un error interno.', 400)
            }
        }
    }
}


module.exports = {
    storageQueries,
    storageMutations,
    storageTypes
}