const Sequelize = require('sequelize')
const connect = require('../database')
const sequelize = connect()
const { enCode } = require('../../utils')

// sequelize.sync()

const ReactionsModel = sequelize.define('reactions', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get(x) { return enCode(this.getDataValue(x)) }
    },
    content: {
        type: Sequelize.STRING,
        allowNull: false
    },
    uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false
    },
    messageId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    rDatCre: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    rDatMod: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {
    timestamps: false,
})

module.exports = ReactionsModel