
const LawyersModel = require('../../../models/lawyers/LawyersModel')
const { getAttributes, deCode, filterKeyObject } = require('../../../utils')
const { ApolloError } = require('apollo-server-errors')
const ThirdPartiesModel = require('../../../models/thirdParties/ThirdPartiesModel')

//Queries
const lawyersQueries = {
    lawyers: async (root, args, context, info) => {
        try {
            const attributes = getAttributes(LawyersModel, info)
            const data = LawyersModel.findAll({ attributes, where: { lState: 1 } })
            return data
        } catch (e) {
            const error = new Error('Lo sentimos, ha ocurrido un error Interno')
            return error
        }
    }
}

//Mutations
const lawyersMutations = {
    setLawyers: async (_root, { input }) => {
        try {
            const { tpId, lId } = input || {}
            let values = {}
            for (const elem in input) if (input !== '__typename') values = { ...values, [elem]: input[elem] }
            if (lId){
                const values = filterKeyObject(input, ['lId', '__typename'])
                await LawyersModel.update({ ...values }, { where: { lId: deCode(lId) } })
                return { ...input }
            } else {
                const isLawyerExist = await LawyersModel.findOne({ attributes:['tpId'], where: { tpId: deCode(tpId) } })
                if (isLawyerExist)
                {throw new Error('El Abogado ya se encuentra registrado.')}

                const data = await LawyersModel.create({ lState: 1, tpId, ...input })
                return { lState: 1, ...input, lId: data.lId }
            }
        } catch (e) {
            throw new ApolloError(e.message)
        }
    }
}

//Types
const lawyersTypes = {
    Lawyer: {
        thirdParties: async parent => {
            try {
                const res = await ThirdPartiesModel.findOne({ attributes: ['tpId', 'umId', 'tpNumDoc', 'tpName', 'tpLasNam', 'tpPhone', 'tpEmail', 'tpState'], where: { tpId: deCode(parent.tpId) } })
                return res
            } catch (error) {
                return null
            }
        }
    }
}

module.exports = {
    lawyersQueries,
    lawyersMutations,
    lawyersTypes
}