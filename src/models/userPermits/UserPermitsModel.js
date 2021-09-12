const Sequelize = require('sequelize')
const connect = require('../database')
const sequelize = connect()
const { enCode, validationID } = require('../../utils')
const SubModulesModel = require('../subModules/SubModulesModel')
const Users = require('../UsersLogin/Users')

const UserPermitsModel = sequelize.define('userpermits', {
    upId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get(x) {return enCode(this.getDataValue(x))},
    },
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
            model: Users,
            key: 'id'
        },
        get(x) {return enCode(this.getDataValue(x))},
        set(x) {this.setDataValue('id', validationID(x, false))}
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
    upState: {
        type: Sequelize.TINYINT,
        allowNull: false
    },
    upDatCre: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    upDatMod: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {
    timestamps: false,
    hooks: {
        afterBulkCreate: (model, options) => model
    }
})

module.exports = UserPermitsModel