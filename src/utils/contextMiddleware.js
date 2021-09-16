const jwt = require('jsonwebtoken')
const { PubSub } = require('apollo-server')

const pubsub = new PubSub()

module.exports = context => {
    let token
    if (context.req && context.req.headers.authorization) {
        token = context.req.headers.authorization
    } else if (context.connection && context.connection.context.Authorization) {
        token = context.connection.context.Authorization
    }
    if (token !== 'null'){
        try {
            //validate user in client.
            const User = jwt.verify(token, process.env.AUTHO_USER_KEY);
            return { User }
        } catch (err){
            // eslint-disable-next-line no-console
            console.log(err)
            // eslint-disable-next-line no-console
            console.log('Hola esto es un error del contexto')
        }
    }
    context.pubsub = pubsub
    return context
}