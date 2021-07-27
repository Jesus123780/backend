const Sequelize = require('sequelize')
const connect = require('../database')
const sequelize = connect()
const { enCode } = require('../../utils')
const CountriesModel = require('./CountriesModel')

const DepartmentsModel = sequelize.define('departments', {
    dId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get(x) {return enCode(this.getDataValue(x))}
    },
    cId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
            model: CountriesModel,
            key: 'cId'
        },
        get(x) {return enCode(this.getDataValue(x))}
    },
    dName: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    dState: {
        type: Sequelize.SMALLINT,
        allowNull: false
    },
    dDatCre: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    dDatMod: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {
    timestamps: false
})

module.exports = DepartmentsModel