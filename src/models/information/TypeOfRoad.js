const Sequelize = require('sequelize')
const connect = require('../database')
const sequelize = connect()
const { enCode } = require('../../utils')

// sequelize.sync()

const TypeRoad = sequelize.define('typeRoad', {
    rId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get(x) {return enCode(this.getDataValue(x))}
    },
    rName: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    rState: {
        type: Sequelize.SMALLINT,
        defaultValue: 1
    },
    rDatCre: {
        type: Sequelize.DATE,
        default: Date.now()
    },
    rDatMod: {
        type: Sequelize.DATE,
        default: Date.now()
    }
}, {
    timestamps: false
})

module.exports = TypeRoad