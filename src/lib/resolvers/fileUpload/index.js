const AWS = require('aws-sdk')
const UserMasterModel = require('../../../models/users/userMasterModel')
const StorageModel = require('../../../models/Storage/StorageModel')
const { deCode } = require('../../../utils')
const { ApolloError } = require('apollo-server')
const { awsGetFiles } = require('../../hooks/awsFiles')

//Queries
const fileUploadQueries = {
    filePath: async (_, { umId, key }) => {
        try {
            const storage = await StorageModel.findOne({ attributes: ['sAccessKeyId', 'sSecretAccessKey', 'sName'], where: { sState: 1, umId: deCode(umId) } })
            const { sAccessKeyId, sSecretAccessKey, sName } = storage.dataValues

            const { urlFile, error } = await awsGetFiles({ Key: key, accessKeyId: sAccessKeyId, secretAccessKey: sSecretAccessKey, Bucket: sName })
            if (error) throw error

            return { path: urlFile }
        } catch (err) {
            if (err.code === 'NoSuchKey') throw new ApolloError('No se ha encontrado el archivo solicitado.')
            throw new ApolloError('Ha ocurrido un error interno.')
        }
    }
}

//Types
const fileUploadTypes = {

}

//Mutations
const fileUploadMutations = {
    uploadFile: async (_, { file, umId, pnNum, folder }) => {
        try {
            // Consultar el usuario maestro
            const userMaster = await UserMasterModel.findOne({ attributes: ['umId', 'umIdAWS'], where: { umId: deCode(umId) } })
            if (!userMaster) throw new Error('Usted no tiene acceso para ejecutar esta acción.', 403)

            // Consultar el bucked
            const awsBucketData = await StorageModel.findOne({ attributes: ['sName', 'sRegion', 'sAccessKeyId', 'sSecretAccessKey', 'sState'], where: { umId: deCode(umId), sState: 1 } })
            if (!awsBucketData) throw new Error('Aún no ha configurado su almacén.', 404)

            // Configurar conexion al bucket
            const awsS3 = new AWS.S3({ accessKeyId: awsBucketData.sAccessKeyId, secretAccessKey: awsBucketData.sSecretAccessKey, region: awsBucketData.sRegion })

            const fileUpload = await file
            const { createReadStream, filename } = fileUpload
            const extFile = filename.substring(filename.lastIndexOf('.'), filename.length)
            // Create upload Stream
            const fileStream = createReadStream()
            const keyName = `${ pnNum }${ extFile }`

            const uploadParams = { Bucket: awsBucketData.sName, Key: folder ? `${ folder }/${ keyName }` : keyName, Body: fileStream }

            await awsS3.upload(uploadParams).promise()

            return { ...fileUpload, filename: keyName }

        } catch (e) {
            console.log(e)
            if (e.code === 'UnknownEndpoint') throw new ApolloError('No se podido establecer conexión con el servidor de almacenamiento.')
            throw new ApolloError(e.message)
        }
    }
}

module.exports = {
    fileUploadQueries,
    fileUploadTypes,
    fileUploadMutations
}