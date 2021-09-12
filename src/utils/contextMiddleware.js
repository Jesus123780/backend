const { ApolloError } = require('apollo-server')
const { JsonWebTokenError } = require('jsonwebtoken');

module.exports = (context) => {
    console.log(context)
    const token = (context.req.headers.authorization)
    if (token) {
        try {
            const User = JsonWebTokenError.verify(
                token.replace('', ''),
                process.env.AUTHO_USER_KEY
            );
            return { User }
        } catch (error) {
            console.log(error)
            console.log('Hola esto es un error del contexto')
            throw new ApolloError('No ha sido posible procesar su solicitud.', 500)
        }
    }
}