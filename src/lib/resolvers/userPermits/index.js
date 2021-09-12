'use strict'

const { Op } = require('sequelize')
const UserPermitsModel = require('../../../models/userPermits/UserPermitsModel')
const UsersModel = require('../../../models/users/UsersModel')
const { getAttributes, deCode } = require('../../../utils')

// Queries
const userPermitsQueries = {
    userPermits: async (root, { state, id }, context, info) => {
        try {
            const attributes = getAttributes(UserPermitsModel, info)
            const data = await UserPermitsModel.findAll({ attributes, where: { uId: deCode(id), upState: state ? state : { [Op.gte]: 0 } } })
            return data
        } catch (e) {
            const error = new Error('Lo sentimos, ha ocurrido un error interno')
            return error
        }
    }
}

// Mutations
const userPermitsMutations = {
    createUserPermits: async (_, { input }) => {
        console.log(input)
        try {
            const { uId, smData } = input
            const dataValues = smData?.map(x => ({ uId, upState: x.upState ? x.upState : (x.upState === 0 ? 0 : 1), ...x }))
            const dataRegister = dataValues?.filter(x => !x.upId)
            const dataUpdates = dataValues?.filter(x => x.upId)
            let res = []

            for (let i = 0; i < dataUpdates.length; i++) {
                const response = await UserPermitsModel.update({ smId: dataUpdates[i].smId, upState: dataUpdates[i].upState }, { where: { upId: deCode(dataUpdates[i].upId) } })
                res = [ ...res, dataUpdates[i], response.upId ]
            }
            for (let i = 0; i < dataRegister.length; i++) {
                const response = await UserPermitsModel.create({ ...dataRegister[i] })
                res = [ ...res, { ...dataRegister[i], upId: response.upId } ]
            }

            return res
        } catch (e) {
            // await UsersModel.destroy({
            //     where: { uId: input.uId }
            // })
            const error = new Error('Lo sentimos, ha ocurrido un error interno')
            return error
        }
    }
}

module.exports = {
    userPermitsQueries,
    userPermitsMutations
}