const Sequelize = require('sequelize')
const connect = require('../database')
const sequelize = connect()
const { enCode } = require('../../utils')
const colorModel = require('./color')
const CountriesModel = require('../locations/CountriesModel')
const DepartmentsModel = require('../locations/DepartmentsModel')
const CitiesModel = require('../locations/CitiesModel')

// sequelize.sync()

const productsModel = sequelize.define('products', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get (x) { return this.getDataValue(x) ? enCode(this.getDataValue(x)) : null }
    },
    // scpro_id: {
    //     type: Sequelize.INTEGER,
    //     allowNull: false,
    //     onUpdate: 'CASCADE',
    //     onDelete: 'CASCADE',
    //     references: {
    //         model: SubCategoryProductsModel,
    //         key: 'scpro_id'
    //     },
    //     get (x) { return this.getDataValue(x) ? enCode(this.getDataValue(x)) : null }
    // },
    ProName: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    ProPrice: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    ProDescuento: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    ProUniDisponibles: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    ProDescription: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    // color
    colorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
            model: colorModel,
            key: 'colorId'
        },
        get (x) { return this.getDataValue(x) ? enCode(this.getDataValue(x)) : null }
    },
    // Si el producto esta asegurado ( Protegido )
    ProProtegido: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    // Si ( ESTA EN LAS MEJORES CALIFICACIONES DE LA APLICACIÓN )
    ProStarRanking: {
        type: Sequelize.FLOAT,
        allowNull: true
    },
    // GARANTÍA )
    ProAssurance: {
        type: Sequelize.STRING,
        allowNull: true
    },
    // Numero de estrellas
    ProStar: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    ProImage: {
        type: Sequelize.STRING,
        trim: true,
        allowNull: false
    },
    // Ancho
    ProWidth: {
        type: Sequelize.INTEGER,
        defaultValue: 1
    },
    // Alto
    ProHeight: {
        type: Sequelize.INTEGER,
        defaultValue: 1
    },
    // Largo
    ProLength: {
        type: Sequelize.INTEGER,
        defaultValue: 1
    },
    // Peso
    ProWeight: {
        type: Sequelize.INTEGER,
        defaultValue: 1
    },
    // Cantidad
    ProQuantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    // Destacado
    ProOutstanding: {
        type: Sequelize.INTEGER
    },
    // Entrega
    ProDelivery: {
        type: Sequelize.INTEGER
    },
    // CAMBIO DE ESTADO PARA BORRAR EL PRODUCTO
    ProState: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: 1
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

    ProDatCre: {
        type: Sequelize.DATE,
        default: Date.now()
    },
    ProDatMod: {
        type: Sequelize.DATE,
        allowNull: true
    }
}, {
    timestamps: false
})

module.exports = productsModel