const Sequelize = require('sequelize')
const connect = require('../database')
const sequelize = connect()
const { enCode, validationID } = require('../../utils')
const ThirdPartiesModel = require('../thirdParties/ThirdPartiesModel')
const CitiesModel = require('../information/CitiesModel')
const DepartmentsModel = require('../information/DepartmentsModel')
const CountriesModel = require('../information/CountriesModel')
const colorModel = require('./color')
const trademarkModel = require('./trademark')
const SizeModel = require('../information/size')

// sequelize.sync()

const ProductsModel = sequelize.define('products', {
    pId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get(x) {return enCode(this.getDataValue(x))},
    },
    tpId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
            model: ThirdPartiesModel,
            key: 'tpId'
        },
        // unique: true,
        get(x) {return enCode(this.getDataValue(x))},
        set(x) {this.setDataValue('tpId', validationID(x, false))}
    },
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
    // Entrega
    ProVoltaje: {
        type: Sequelize.STRING,
        allowNull: true
    },
    // CAMBIO DE ESTADO PARA BORRAR EL PRODUCTO
    ProState: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1
    },
    // talla del producto
    sizeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
            model: SizeModel,
            key: 'sizeId'
        },
        get (x) { return this.getDataValue(x) ? enCode(this.getDataValue(x)) : null }
    },
    // Marca comercial de producto
    tId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
            model: trademarkModel,
            key: 'tId'
        },
        get (x) { return this.getDataValue(x) ? enCode(this.getDataValue(x)) : null }
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

module.exports = ProductsModel