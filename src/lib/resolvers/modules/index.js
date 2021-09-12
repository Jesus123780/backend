'use strict'

const { ApolloError } = require('apollo-server')
const { Op, col, where } = require('sequelize')
const ModulesModel = require('../../../models/modules/ModulesModel')
const SubModulesModel = require('../../../models/subModules/SubModulesModel')
const UserPermitsModel = require('../../../models/userPermits/UserPermitsModel')
const { getAttributes, deCode, linkHasMany } = require('../../../utils')

// Queries
const moduleQueries = {
    modules: async (_root, { input }, _context, info) => {
        try {
            const { uId, upState } = input || {}
            // Relaciones
            linkHasMany(ModulesModel, SubModulesModel, 'mId', 'mId')
            // Consulta
            const resPermits = await UserPermitsModel.findAll({
                attributes: ['smId'],
                where: { uId: deCode(uId), upState }
            })

            const attributes = getAttributes(ModulesModel, info)
            const data = await ModulesModel.findAll({
                attributes,
                include: [
                    {
                        attributes: ['smId'],
                        model: SubModulesModel
                    }
                ],
                where: where(col('submodules.smId'), {
                    [Op.in]: resPermits.map(x => deCode(x.smId))
                }),
                order: [['mPriority', 'ASC']]
            })
            return data
        } catch (e) {
            const error = new ApolloError(
                'Lo sentimos, ha ocurrido un error interno weon'
            )
            return error
        }
    },
    moduleSinPermits: async (_root, args, context, info) => {
        try {
            const attributes = getAttributes(ModulesModel, info)
            const data = ModulesModel.findAll({ attributes })
            return data
        } catch (e) {
            const error = new Error('Lo sentimos, ha ocurrido un error interno')
            return error
        }
    },
}

// Mutations
const moduleMutations = {
    createModule: async (root, { input }) => {
        try {
            const data = await ModulesModel.create({ ...input, mState: 1 })
            return { ...input, mId: data.mId }
        } catch (e) {
            const error = new ApolloError(
                'Lo sentimos, ha ocurrido un error interno'
            )
            return error
        }
    }
}

// Types
const moduleTypes = {
    Module: {
        subModules: async ({ submodules }) => {
            try {
                const data = await SubModulesModel.findAll({
                    attributes: [
                        'smName',
                        'smId',
                        'mId',
                        'smPath',
                        'smPriority',
                        'smPath',
                        'smState'
                    ],
                    where: {
                        smId: submodules?.length
                            ? { [Op.in]: submodules.map((x) => deCode(x.smId)) }
                            : -1
                    },
                    order: [['smPriority', 'ASC']]
                })
                return data
            } catch (e) {
                const error = new ApolloError(
                    'Lo sentimos, ha ocurrido un error interno'
                )
                return error
            }
        }
    }
}

module.exports = {
    moduleQueries,
    moduleMutations,
    moduleTypes
}