const { ApolloError } = require('apollo-server-errors')
const { Op } = require('sequelize')
const StorageModel = require('../../../models/Storage/StorageModel')
const GeneralDocumentsModel = require('../../../models/generalFolders/GeneralDocumentsModel')
const { deCode, getAttributes, enCode } = require('../../../utils')
const { awsGetFiles } = require('../../hooks/awsFiles')

// Queries
const generalDocumentsQueries = {
    generalDocuments: async (root, { input: { cId, gfId, umId } }, context, resolveInfo) => {
        try {
            const attributes = getAttributes(GeneralDocumentsModel, resolveInfo)
            const data = await GeneralDocumentsModel.findAll({
                attributes,
                where: {
                    cId: cId ? deCode(cId) : { [Op.gte]: 0 },
                    gfId: gfId ? deCode(gfId) : { [Op.gte]: 0 }
                }
            })

            /** Busca la ur de la ruta en amazon */
            const storage = await StorageModel.findOne({
                attributes: ['sAccessKeyId', 'sSecretAccessKey', 'sName'],
                where: { sState: 1, umId: deCode(umId) }
            })
            if (!storage?.dataValues) throw new Error('Usted aún no ha configurado su almacén de datos.')
            const { sAccessKeyId, sSecretAccessKey, sName } = storage.dataValues

            let response = []
            for (let i = 0; i < data.length; i++) {
                const { cId: cliId, gfId: folderId, gdId } = data[i].dataValues
                const { urlFile, error } = await awsGetFiles({
                    Key: `generals/files/${ data[i].dataValues.gdSecNam }`,
                    accessKeyId: sAccessKeyId,
                    secretAccessKey: sSecretAccessKey,
                    Bucket: sName
                })
                response = [
                    ...response,
                    {
                        ...data[i].dataValues,
                        eId: enCode(cliId),
                        efId: enCode(folderId),
                        rId: enCode(gdId),
                        path: urlFile
                    }
                ]
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
const generalDocumentsMutation = {
    createGeneralDocument: async (root, { input }) => {
        try {
            const data = await GeneralDocumentsModel.create({ ...input, gdState: 1 })
            return { ...input, gdId: data.gdId }
        } catch (e) {
            return e
        }
    }
}

module.exports = {
    generalDocumentsQueries,
    generalDocumentsMutation
}