const { ApolloError } = require('apollo-server-errors')
const { Op } = require('sequelize')
const EmployeesModel = require('../../../models/employees/EmployeesModel')
const EmployeesRequirementsModel = require('../../../models/employees/EmployeesRequirementsModel')
const StorageModel = require('../../../models/Storage/StorageModel')
const { deCode, getAttributes, enCode } = require('../../../utils')
const { awsGetFiles } = require('../../hooks/awsFiles')

// Queries
const employeeRequirementsQueries = {
    // Queries
    employeeRequirements: async (root, { input: { eId, efId, umId } }, context, resolveInfo) => {
        try {
            const attributes = getAttributes(EmployeesRequirementsModel, resolveInfo)
            const data = await EmployeesRequirementsModel.findAll({ attributes,
                where: {
                    eId: eId ? deCode(eId) : { [Op.gte]: 0 },
                    efId: efId ? deCode(efId) : { [Op.gte]: 0 },
                } })

            /** Busca la ur de la ruta en amazon */
            const storage = await StorageModel.findOne({ attributes: ['sAccessKeyId', 'sSecretAccessKey', 'sName'], where: { sState: 1, umId: deCode(umId) } })
            if (!storage?.dataValues) throw new Error('Usted aún no ha configurado su almacen de datos.')
            const { sAccessKeyId, sSecretAccessKey, sName } = storage.dataValues

            let response = []
            for (let i = 0; i < data.length; i++){
                const { eId, efId, erId, rId } = data[i].dataValues
                const { urlFile, error } = await awsGetFiles({ Key: `files/documentManagement/${ data[i].dataValues.erSecNam }`, accessKeyId: sAccessKeyId, secretAccessKey: sSecretAccessKey, Bucket: sName })
                response = [...response, { ...data[i].dataValues, eId: enCode(eId), efId: enCode(efId), erId: enCode(erId), rId: enCode(rId), path: urlFile }]
                if (error?.code && error?.code !== 'NoSuchKey') throw error
            }

            return response
        } catch (e) {
            if (e?.code === 'NoSuchKey') throw new ApolloError('No se ha encontrado el archivo solicitado.')
            return e
        }
    }
}
// Mutations
const employeeRequirementsMutation = {
    setEmployeeRequirements: async (root, { input }) => {
        try {
            const data = await EmployeesRequirementsModel.create({ ...input, erState: 1 })
            return { ...input, erId: data.erId }
        } catch (e) {
            return e
        }
    }
}

module.exports = {
    employeeRequirementsQueries,
    employeeRequirementsMutation
}