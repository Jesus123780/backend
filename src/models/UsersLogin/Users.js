const Sequelize = require('sequelize')
const connect = require('../database')
const sequelize = connect()
const { enCode } = require('../../utils')
const CitiesModel = require('../information/CitiesModel')
const DepartmentsModel = require('../information/DepartmentsModel')
const CountriesModel = require('../information/CountriesModel')

// sequelize.sync()

const Users = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get (x) { return enCode(this.getDataValue(x)) }
    },

    name: {
        type: Sequelize.STRING,
        require: true
    },
    username: {
        type: Sequelize.STRING,
        require: true,
        trim: true,
        unique: true
    },
    lastName: {
        type: Sequelize.STRING,
        require: true,
        trim: true,
        unique: true
    },
    email: {
        type: Sequelize.STRING,
        require: true,
        trim: true,
        unique: true
    },
    avatar: {
        type: Sequelize.STRING,
        trim: true
    },
    // News
    uToken: {
        type: Sequelize.STRING(100),
        trim: true
    },
    uPhoNum: {
        type: Sequelize.STRING(50)
    },
    ULocation: {
        type: Sequelize.STRING(100)
    },
    upLat: {
        type: Sequelize.STRING(30)
    },
    upLon: {
        type: Sequelize.STRING(30)
    },
    upIdeDoc: {
        type: Sequelize.STRING(50)
    },
    // Locations
    cId: {
        type: Sequelize.INTEGER,
        onUpdate: null,
        onDelete: null,
        references: {
            model: CountriesModel,
            key: 'cId'
        },
        get (x) { return this.getDataValue(x) ? enCode(this.getDataValue(x)) : null }
    },
    dId: {
        type: Sequelize.INTEGER,
        onUpdate: null,
        onDelete: null,
        references: {
            model: DepartmentsModel,
            key: 'dId'
        },
        get (x) { return this.getDataValue(x) ? enCode(this.getDataValue(x)) : null }
    },
    ctId: {
        type: Sequelize.INTEGER,
        onUpdate: null,
        onDelete: null,
        references: {
            model: CitiesModel,
            key: 'ctId'
        },
        get (x) { return this.getDataValue(x) ? enCode(this.getDataValue(x)) : null }
    },

    siteWeb: {
        type: Sequelize.STRING,
        trim: true
    },
    description: {
        type: Sequelize.STRING,
        trim: true
    },
    password: {
        type: Sequelize.STRING,
        trim: true,
        require: true
    },
    createAt: {
        type: Sequelize.DATE,
        default: Date.now()
    }

})

module.exports = Users