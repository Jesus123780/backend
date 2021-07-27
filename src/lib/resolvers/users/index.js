'use strict'

const { Op } = require('sequelize')
const SubModulesModel = require('../../../models/subModules/SubModulesModel')
const UserMastersModel = require('../../../models/users/userMasterModel')
const UsersModel = require('../../../models/users/UsersModel')
const { getAttributes, deCode } = require('../../../utils')
const { ApolloError } = require('apollo-server')
const UserPermitsModel = require('../../../models/userPermits/UserPermitsModel')

// Queries
const userQueries = {
    userLogin: async (root, { username, password }) => {
        try {
            const data = await UsersModel.findOne({
                attributes: [
                    'uId',
                    'uName',
                    'uLasNam',
                    'umId',
                    'uPhone',
                    'uEmail'
                ],
                where: { uEmail: username, uPassword: password }
            })
            if (!data) return new ApolloError('Usuario y contraseña incorrecta.', 1)

            return data
        } catch (e) {
            const error = new ApolloError('Lo sentimos, ha ocurrido un error interno.', 400)
            return error
        }
    },
    users: async (root, { id, uState }, context, info) => {
        try {
            const attributes = getAttributes(UsersModel, info)
            const data = await UsersModel.findAll({
                attributes,
                where: { umId: deCode(id), uState: uState || { [Op.gt]: 0 } }
            })
            return data
        } catch (e) {
            const error = new ApolloError('Lo sentimos, ha ocurrido un error interno', 400)
            return error
        }
    },
    user: async (_root, { id, state }, _context, info) => {
        try {
            const attributes = getAttributes(UsersModel, info)
            const data = await UsersModel.findOne({
                attributes,
                where: {
                    uId: deCode(id),
                    uState: state ? state : { [Op.gte]: 0 }
                }
            })
            return data
        } catch (err) {
            return new ApolloError('Lo sentimos, ha ocurrido un error interno', 400)
        }
    },
    userMaster: async (root, { umIdAWS }, context, info) => {
        try {
            const attributes = getAttributes(UserMastersModel, info)
            const data = UserMastersModel.findOne({
                attributes,
                where: { umIdAWS }
            })
            return data
        } catch (e) {
            const error = new ApolloError('Lo sentimos, ha ocurrido un error interno', 400)
            return error
        }
    }
}

// Mutations
const userMutations = {
    createUser: async (root, { input }) => {
        try {
            let res = {}

            if (input?.uId) {
                let values = {}
                for (const x in input) if (x !== 'uId') values = { ...values, [x]: input[x] }

                res = await UsersModel.update(
                    { ...values },
                    { where: { uId: deCode(input.uId) } }
                )
                return { ...input }
            } else {
                const isExist = await UsersModel.findOne({
                    attributes: ['uId'],
                    where: {
                        [Op.or]: [
                            { uEmail: input.uEmail },
                            { uPhone: input.uPhone }
                        ]
                    }
                })
                if (isExist) return new ApolloError('El usuario ya existe', 409)

                res = await UsersModel.create({ ...input, uState: 1 })
                return { ...input, uId: res.uId }
            }
        } catch (e) {
            const error = new ApolloError('Lo sentimos, ha ocurrido un error interno', 400)
            return error
        }
    },
    createUserMaster: async (_, { umIdAWS, input }) => {
        try {
            // consultar modulos
            const responseGet = await SubModulesModel.findAll({
                attributes: ['smId'],
                where: { smState: { [Op.gte]: 0 } }
            })
            // crear usuario maestro
            const dataUM = await UserMastersModel.create({
                umIdAWS,
                umState: 1
            })
            // crear usuario estandar
            const dataU = await UsersModel.create({
                uState: 1,
                ...input,
                umId: dataUM.umId
            })
            // Crear data para guardar permisos sobre el usuario registrado
            const dataUP = responseGet.map(x => ({
                smId: x.smId,
                uId: dataU.uId,
                upState: 1
            }))
            await UserPermitsModel.bulkCreate(dataUP)

            return {
                umIdAWS,
                umId: dataUM.umId,
                user: { ...input, uId: dataU.uId }
            }
        } catch (e) {
            const error = new ApolloError(
                'Lo sentimos, ha ocurrido un error interno',
                400
            )
            return error
        }
    },
    changeUserState: async (root, { uId, state }) => {
        try {
            //Consultar
            const dataU = await UsersModel.findOne({
                attributes: [
                    'uId',
                    'umId',
                    'uName',
                    'uLasNam',
                    'uPhone',
                    'uEmail'
                ],
                where: { uId: deCode(uId) }
            })
            // crear usuario estandar
            await UsersModel.update(
                { uState: state },
                { where: { uId: deCode(uId) } }
            )
            return { ...dataU.dataValues, uState: state, uId }
        } catch (error) {
            throw new ApolloError('Lo sentimos, ha ocurrido un error interno', 400)
        }
    }
}

module.exports = {
    userQueries,
    userMutations
}