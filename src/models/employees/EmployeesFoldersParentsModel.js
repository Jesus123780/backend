const Sequelize = require('sequelize')
const connect = require('../database')
const sequelize = connect()
const EmployeesFoldersModel = require('./EmployeesFoldersModel')
const { enCode, validationID } = require('../../utils')

const EmployeesFoldersParentsModel = sequelize.define('employeesFoldersParents', {
    efpId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get(x) { return enCode(this.getDataValue(x)) }
    },
    efId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
            model: EmployeesFoldersModel,
            key: 'efId'
        },
        get(x) { return enCode(this.getDataValue(x)) },
        set(x) { this.setDataValue('efId', validationID(x, false)) }
    },
    parentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
            model: EmployeesFoldersModel,
            key: 'efId'
        },
        get(x) { return enCode(this.getDataValue(x)) },
        set(x) { this.setDataValue('parentId', validationID(x, false)) }
    },
    efpLevel: {
        type: Sequelize.INTEGER(4),
        allowNull: false,
        defaultValue: 1
    },
    efpState: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: 1
    },
    efpDatCre: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    efpDatMod: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {
    timestamps: false
})

module.exports = EmployeesFoldersParentsModel