const Sequelize = require('sequelize')
const connect = require('../database')
const sequelize = connect()
const { enCode } = require('../../utils')

const PermitUsersModel = sequelize.define('permitUsers', {
    puId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get(x) {return enCode(this.getDataValue(x))},
    },
    puName: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    puState: {
        type: Sequelize.TINYINT,
        allowNull: false
    },
    puDatCre: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    puDatMod: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {
    timestamps: false,
})

module.exports = PermitUsersModel