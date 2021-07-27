'use strict'

const Sequelize = require('sequelize')
let sequelize = null

module.exports = function connect () {
    try {
        if (!sequelize) {
            sequelize = new Sequelize(
                process.env.NAMEDB, //nombre Base de datos process.env.NAMEDB
                process.env.USERDB, //nombre usuario base de datos process.env.USERDB
                process.env.PASSDB, // clave de base de datos, process.env.PASSDB
                {
                    host: process.env.HOSTDB, //process.env.HOSTDB
                    dialect: process.env.DIALECTDB //process.env.DIALECTDB
                }
            )
        }
        // sequelize.sync()
        return sequelize
    } catch (error) {
        console.log('/**** Error de conexión con base de datos, algunos datos erroneos o el .env no existe.')
    }
}