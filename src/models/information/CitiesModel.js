const Sequelize = require('sequelize')
const connect = require('../database')
const sequelize = connect()
const { enCode } = require('../../utils')
const DepartmentsModel = require('./DepartmentsModel')

// sequelize.sync()

const CitiesModel = sequelize.define('cities', {
    ctId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get(x) {return enCode(this.getDataValue(x))}
    },
    dId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
            model: DepartmentsModel,
            key: 'dId'
        },
        get(x) {return enCode(this.getDataValue(x))}
    },
    cName: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    cState: {
        type: Sequelize.SMALLINT,
        allowNull: false
    },
    cDatCre: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    cDatMod: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {
    timestamps: false,
})

module.exports = CitiesModel