'use strict'

/**
 * @license
 * Configuración del servidor para el proyecto Leypal solutions
 */

if (process.env.NODE_ENV !== 'production') require('dotenv').config()
// const morgan = require('morgan')
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const { ApolloServer } = require('apollo-server-express')
const resolvers = require('./lib/resolvers')
const { fileLoader, mergeTypes } = require('merge-graphql-schemas')
// const { graphqlUploadExpress } = require('graphql-upload')

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
// app.use(graphqlUploadExpress({ maxFileSize: 1000000000, maxFiles: 10 }));
// app.use(morgan('dev'))
app.use(cors())
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method')
    res.header('Access-Control-Allow-Methods', 'GET, POST')
    res.header('Allow', 'GET, POST')
    next()
})

app.set('graphport', process.env.GRAPHPORT || 4000)

// Definiendo el esquema de graphql
const typeDefs = mergeTypes(fileLoader(`${ __dirname }/**/*.graphql`), { all: true })

// Configurando el server de apollo
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => {
        const token = (req.headers.authorization)
        if (token) {
            try {
                const User = jwt.verify(
                    token.replace('', ''),
                    process.env.AUTHO_USER_KEY
                );
                return { User, res }
            } catch (error) {
                console.log(error)
                console.log('Hola esto es un error del contexto')
            }
        }
    },
    uploads: false
})
server.start();

app.use(express.json({ limit: '50mb' }))
server.applyMiddleware({
    path: '/',
    app,
    bodyParserConfig: false
})

// Sirviendo puertos para peticiones
new Promise(resolve => app.listen({ port: app.get('graphport') }, resolve)).then(() => console.log('Ha iniciado graphql'))