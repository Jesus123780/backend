'use strict'

const Sequelize = require('sequelize')
const connect = require('../database')
const sequelize = connect()

const EmployeesModel = require('./EmployeesModel')

const { enCode, validationID } = require('../../utils')

const EmployeesFoldersModel = sequelize.define('employeesFolders', {
    efId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get(x) { return enCode(this.getDataValue(x)) }
    },
    eId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
            model: EmployeesModel,
            key: 'eId'
        },
        get(x) { return enCode(this.getDataValue(x)) },
        set(x) { this.setDataValue('eId', validationID(x, false)) }
    },
    efName: {
        type: Sequelize.STRING(60),
        allowNull: false,
        defaultValue: 'New Folder'
    },
    efLevel: {
        type: Sequelize.INTEGER(4),
        allowNull: false,
        defaultValue: 1,
    },
    efState: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: 1
    },
    efDatCre: {
        type: 'TIMESTAMP', 
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    efDatMod: {
        type:'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {
    timestamps: false
})

module.exports = EmployeesFoldersModel