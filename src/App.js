'use strict'

/**
 * @license
 * Configuración del servidor para el proyecto Ifood
 */

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const jwt = require('jsonwebtoken')
const express = require('express')
const morgan = require('morgan')
const BodyParser = require('body-parser')
const cors = require('cors')
const { ApolloServer } = require('apollo-server')
// Initializations
const app = express()
// Config of Graphql
const resolvers = require('./lib/resolvers')
const { fileLoader, mergeTypes } = require('merge-graphql-schemas')
const contextMiddleware = require('./utils/contextMiddleware')
// Puerto Graphql
app.set('graphport', process.env.GRAPHPORT || 4000)

// Middleware
app.use(morgan('dev'))
app.use(BodyParser.json())
app.use(BodyParser.urlencoded({ extended: true }))
app.use(cors())
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method')
    res.header('Access-Control-Allow-Methods', 'GET, POST')
    res.header('Allow', 'GET, POST')
    next()
})

// Definiendo el esquema de graphql
const typeDefs = mergeTypes(fileLoader(`${ __dirname }/**/*.graphql`), { all: true })

app.use(express.json({ limit: '50mb' }))
// Configurando el server de apollo
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: contextMiddleware
});

// context: async ({ req, connection, res }) => {
//     if (connection) {
//         // check connection for metadata
//         return connection.context;
//     } else {
//         // check from req
//         const token = (req.headers.authorization)
//         if (token !== 'null'){
//             try {
//                 //validate user in client.
//                 const User = await jwt.verify(token, process.env.AUTHO_USER_KEY);
//                 return { User, res }
//             } catch (err){
//                 console.log(err)
//                 console.log('Hola esto es un error del contexto')
//             }
//         }

//     }
// },
// Sirviendo puertos para peticiones
server.listen({ port: app.get('graphport') }).then(() => console.log(`Ha iniciado graphql en el puerto ${ app.get('graphport') }`))