'use strict'

const { Op } = require('sequelize')
const AreasModel = require('../../../models/featuresProducts/AreasModel')
const { ApolloError } = require('apollo-server-errors')
const { getAttributes, deCode, filterKeyObject } = require('../../../utils')
const EmployeesFoldersModel = require('../../../models/employees/EmployeesFoldersModel')

// Queries
const employeeFoldersQueries = {
    employeesFolders: async (_root, { eId, efState }, _context, info) => {
        /** Relación */
        try {
            const attributes = getAttributes(EmployeesFoldersModel, info) || []
            const data = await EmployeesFoldersModel.findAll({ attributes, where: { efState: efState || 1, eId: deCode(eId), efLevel: 1 } })
            return data
        } catch (e) {
            return e
        }
    },
}

//Mutations
const employeeFoldersMutations = {
    createEmployeeFolders: async (root, { input }) => {
        try {
            const { efId } = input || {}
            if (efId){
                const values = filterKeyObject(input, ['efId', '__typename'])
                await EmployeesFoldersModel.update({ ...values }, { where: { efId: deCode(efId) } })
                return { ...input }

            } else {
                const data = await EmployeesFoldersModel.create({ efState: 1, ...input })
                return { efState: 1, ...input, efId: data.efId }
            }
        } catch (e) {
            throw new ApolloError(e.message)
        }
    }
}

// Types
const employeeFoldersTypes = {
    Employee: {
        area: async parent => {
            try {
                const data = await AreasModel.findOne({ where: { aId: parent.aId ? deCode(parent.aId) : { [Op.gte]: 0 } } })
                return data
            } catch (e) {
                return e
            }
        }
        // },thirdParties: async parent => {
        //     try {
        //         const res = await ThirdPartiesModel.findOne({ attributes: ['tpId', 'umId', 'tpNumDoc', 'tpName', 'tpLasNam', 'tpPhone', 'tpEmail', 'tpState'], where: { tpId: deCode(parent.tpId) } })
        //         return res
        //     } catch (error) {
        //         return null
        //     }
        // }
    },
}

module.exports = {
    employeeFoldersQueries,
    employeeFoldersMutations,
    employeeFoldersTypes,
    // employeeMutations
}