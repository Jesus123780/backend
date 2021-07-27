const Sequelize = require('sequelize')
const connect = require('../database')
const EmployeesModel = require('../employees/EmployeesModel')
const RequirementsModel = require('../requirements/RequirementsModel')
const sequelize = connect()
const {enCode, validationID} = require('../../utils')
const EmployeesFoldersModel = require('./EmployeesFoldersModel')

const EmployeesRequirementsModel = sequelize.define('employeesrequirements', {
    erId: {
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
        set(x) {return this.setDataValue('eId', validationID(x, false))}
    },
    rId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
            model: RequirementsModel,
            key: 'rId'
        },
        get(x) { return enCode(this.getDataValue(x)) },
        set(x) {return this.setDataValue('rId', validationID(x, false))}
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
        set(x) { return this.setDataValue('efId', validationID(x, false)) }
    },
    erName: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    erSecNam: {
        type: Sequelize.STRING(50)
    },
    erObs: {
        type: Sequelize.STRING(200)
    },
    erState: {
        type: Sequelize.SMALLINT,
        allowNull: false
    },
    erDatCre: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    erDatMod: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
},{
    timestamps: false,
})

module.exports = EmployeesRequirementsModel