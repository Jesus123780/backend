const Sequelize = require('sequelize')
const connect = require('../database')
const sequelize = connect()
const { enCode } = require('../../utils')

const ModulesModel = sequelize.define('modules', {
    mId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get(x) {return enCode(this.getDataValue(x))},
    },
    mName: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    mPath: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    mPriority: {
        type: Sequelize.TINYINT,
        allowNull: false
    },
    mIcon: {
        type: Sequelize.TINYINT,
        allowNull: false
    },
    mState: {
        type: Sequelize.TINYINT,
        allowNull: false
    },
    mDatCre: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    mDatMod: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {
    timestamps: false,
})

module.exports = ModulesModel