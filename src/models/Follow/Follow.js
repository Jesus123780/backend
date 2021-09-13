const Sequelize = require('sequelize')
const connect = require('../database')
const sequelize = connect()
const { enCode } = require('../../utils')
const Users = require('../UsersLogin/Users')

// sequelize.sync()

const FollowModel = sequelize.define('followModel', {
    idFollower: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get(x) { return enCode(this.getDataValue(x)) }
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
        unique: false,
        get(x) { return enCode(this.getDataValue(x)) },
    },
    follow: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
            model: Users,
            key: 'id'
        },
        unique: false,
        get(x) { return enCode(this.getDataValue(x)) },
    },
    fState: {
        type: Sequelize.SMALLINT,
        allowNull: false
    },
    DatCre: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    DatMod: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {
    timestamps: false,
})

module.exports = FollowModel