const { Op } = require('sequelize')
const User = require('../../models/UsersLogin/Users')
const bcrypt = require('bcryptjs');
const { ApolloError } = require('apollo-client');
const jwt = require('jsonwebtoken');
const deCode = require('../../utils');
/**
 * Crea una solicitud para recuperación de contraseña * 
 * @param {Object} _ No usado
 * @param {Oject} args Argumentos de la petición
 * @return {Object} GQL response
 */
async function recoverAccount(input, args, context) {
    const { email, password } = input;
    console.log(context)
    try {
        console.log('hola mundo')
    } catch (error) {
        console.log(error)
        throw new ApolloError('No ha sido posible procesar su solicitud.', 500)
    }
}

module.exports = {
    recoverAccount,
}   