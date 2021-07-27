const Sequelize = require('sequelize')
const connect = require('../database')
const sequelize = connect()
const { enCode } = require('../../utils')

// sequelize.sync()

const trademarkModel = sequelize.define('trademark', {
    tId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get (x) { return this.getDataValue(x) ? enCode(this.getDataValue(x)) : null }
    },
    Name: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    Icon: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    DatCre: {
        type: Sequelize.DATE,
        default: Date.now()
    },
    DatMod: {
        type: Sequelize.DATE,
        allowNull: true
    }
}, {
    timestamps: false
})

module.exports = trademarkModel