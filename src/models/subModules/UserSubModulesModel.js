const Sequelize = require('sequelize')
const connect = require('../database')
const sequelize = connect()
const { enCode, validationID } = require('../../utils')
const UserModulesModel = require('../modules/UserModulesModel')
const SubModulesModel = require('./SubModulesModel')

/**
 * @deprecated
 */
const UserSubModulesModel = sequelize.define('usersubmodules', {
    usmId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get(x) {return enCode(this.getDataValue(x))},
    },
    umdId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
            model: UserModulesModel,
            key: 'umdId'
        },
        get(x) {return enCode(this.getDataValue(x))},
        set(x) {this.setDataValue('umdId', validationID(x, false))}
    },
    smId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
            model: SubModulesModel,
            key: 'smId'
        },
        get(x) {return enCode(this.getDataValue(x))},
        set(x) {this.setDataValue('smId', validationID(x, false))}
    },
    usmPriority: {
        type: Sequelize.TINYINT,
        allowNull: false
    },
    usmState: {
        type: Sequelize.TINYINT,
        allowNull: false
    },
    usmDatCre: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    usmDatMod: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
},{
    timestamps: false,
})

module.exports = UserSubModulesModel