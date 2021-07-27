'use strict'

const { Op } = require('sequelize')
const AreasModel = require('../../../models/featuresProducts/AreasModel')
const { ApolloError } = require('apollo-server-errors')
const EmployeesModel = require('../../../models/employees/EmployeesModel')
const {
    getAttributes,
    deCode,
    linkBelongsTo,
    filterKeyObject
} = require('../../../utils')
const ThirdPartiesModel = require('../../../models/thirdParties/ThirdPartiesModel')

// Queries
const employeesQueries = {
    employees: async (root, { eState, umId, cId, aId }, context, info) => {
        /** Relación */
        linkBelongsTo(EmployeesModel, AreasModel, 'aId', 'aId')
        linkBelongsTo(EmployeesModel, ThirdPartiesModel, 'tpId', 'tpId')
        try {
            const attributes = getAttributes(EmployeesModel, info) || []
            const data = await EmployeesModel.findAll({
                attributes,
                include: [
                    {
                        attributes: ['tpId', 'umId'],
                        model: ThirdPartiesModel,
                        where: { tpState: 1, umId: deCode(umId) },
                        required: true
                    },
                    {
                        attributes: ['aId', 'cId'],
                        model: AreasModel,
                        where: {
                            aState: 1,
                            cId: cId ? deCode(cId) : { [Op.gt]: 0 }
                        },
                        required: true
                    }
                ],
                where: {
                    eState: eState || 1,
                    aId: aId ? deCode(aId) : { [Op.gt]: 0 }
                }
            })
            return data
        } catch (e) {
            return e
        }
    }
}

//Mutations
const employeeMutations = {
    createEmployee: async (root, { input }) => {
        try {
            const { tpId, eId } = input || {}
            if (eId) {
                await EmployeesModel.update(
                    { ...filterKeyObject(input, ['eId', '__typename']) },
                    { where: { eId: deCode(eId) } }
                )
                return { ...input }
            } else {
                const isEmployeeExist = await EmployeesModel.findOne({
                    attributes: ['eId', 'tpId', 'eState'],
                    where: { tpId: deCode(tpId) }
                })
                if (isEmployeeExist) {
                    if (isEmployeeExist.dataValues.eState === 0) {
                        await EmployeesModel.update({ ...input, eState: 1 }, { where: { eId: isEmployeeExist.dataValues.eId } })
                        return { ...input, eState: 1 }
                    }

                    throw new Error('El empleado ya se encuentra registrado.')
                }

                const data = await EmployeesModel.create({ eState: 1, tpId, ...input })
                return { ...input, eId: data.eId }
            }
        } catch (e) {
            throw new ApolloError(e.message)
        }
    }
}

// Types
const employeesTypes = {
    Employee: {
        area: async parent => {
            try {
                const data = await AreasModel.findOne({
                    where: {
                        aId: parent.aId ? deCode(parent.aId) : { [Op.gte]: 0 }
                    }
                })
                return data
            } catch (e) {
                return e
            }
        },
        thirdParties: async parent => {
            try {
                const res = await ThirdPartiesModel.findOne({
                    attributes: ['tpId', 'umId', 'tpNumDoc', 'tpName', 'tpLasNam', 'tpPhone', 'tpEmail', 'tpState'],
                    where: { tpId: deCode(parent.tpId) }
                })
                return res
            } catch (error) {
                return null
            }
        }
    }
}

module.exports = {
    employeesQueries,
    employeesTypes,
    employeeMutations
}