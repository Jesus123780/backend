const Sequelize = require('sequelize')
const connect = require('../database')
const { enCode, validationID } = require('../../utils')
const UserMastersModel = require('./userMasterModel')
const sequelize = connect()

const UsersModel = sequelize.define('usersNot', {
    uId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get(x) {return enCode(this.getDataValue(x))}
    },
    umId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
            model: UserMastersModel,
            key: 'umId'
        },
        get(x) {return enCode(this.getDataValue(x))},
        set(x) {this.setDataValue('umId', validationID(x, false))}
    },
    uName: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    uLasNam: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    uPhone: {
        type: Sequelize.STRING(20),
        allowNull: false
    },
    uEmail: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
    },
    uPassword: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    uToken: {
        type: Sequelize.STRING(100),
    },
    uState: {
        type: Sequelize.SMALLINT,
        allowNull: false
    },
    uDatCre: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    uDatMod: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
},{
    timestamps: false,
})

module.exports = UsersModel