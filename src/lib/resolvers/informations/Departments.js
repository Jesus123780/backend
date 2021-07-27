'use strict'

const { ApolloError } = require("apollo-server")
const { Op } = require("sequelize")
const DepartmentsModel = require("../../../models/information/DepartmentsModel")
const { getAttributes, deCode } = require("../../../utils")

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


module.exports = {
    departmentsQueries
}