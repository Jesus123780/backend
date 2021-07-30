'use strict'

const { ApolloError } = require('apollo-server')
const { Op } = require('sequelize')
const DepartmentsModel = require('../../../models/information/DepartmentsModel')
const { getAttributes, deCode } = require('../../../utils')

// Queries
const departmentsQueries = {
    departments: async (_root, { cId }, _context, info) => {
        try {
            const attributes = getAttributes(DepartmentsModel, info)
            const data = await DepartmentsModel.findAll({ attributes, where: { cId: deCode(cId), dState: { [Op.gt]: 0 } }, order: [['dName', 'ASC']] })
            return data
        } catch (e) {
            throw new ApolloError('Lo sentimos, ha ocurrido un error interno')
        }
    }
}

// Queries
const departmentsAllQueries = {
    // eslint-disable-next-line
    department: async (_root, _context, info) => {
        try {
            console.log('object')
            const data = await DepartmentsModel.findAll({
                attributes: [
                    'dId',
                    'dName',
                    'dState',
                ],
                order: [['dName', 'DESC']]
            })
            return data
        } catch (e) {
            throw new ApolloError('Lo sentimos, ha ocurrido un error interno')
        }
    }
}
// Mutations
const departmentsMutation = {
    createDepartments: async (_root, { input }) => {
        // eslint-disable-next-line
        const { dName, cId } = input
        try {
            const data = await DepartmentsModel.create({ dName, cId: deCode(cId), dState: 1 })
            return data
        } catch (e) {
            throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)
        }
    }
}
module.exports = {
    departmentsQueries,
    departmentsMutation,
    departmentsAllQueries,
}