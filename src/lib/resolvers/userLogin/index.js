'use strict'
const { ApolloError } = require('apollo-server-errors')
const User = require('../../../models/UsersLogin/Users')
const bcryptjs = require('bcryptjs')
const userController = require('../../../controller/LoginUserController/index')

// Mutations
/** * Registra a un usuario.
 * @param {Object} _root No usado
 * @param {Oject} input Entrada de datos
 * @return {Object} GQL response
 */
const registerUserMutation = {
    // Crear Usuario
    register: async(_root, { input }) => {
        const newUser = input;
        newUser.email = newUser.email.toLowerCase();
        newUser.username = newUser.username.toLowerCase();
        const { email, username, password } = newUser;
        // revisamos si el email existe
        const existEmail = await User.findOne({ attributes: ['email'], where: { email } })
        if (existEmail) throw new Error(`El email '${ email }' ya se encuentra registrado.`)
        // revisamos si el Usuario existe
        const UserName = await User.findOne({ attributes: ['username'], where: { username } })
        if (UserName) throw new Error(`El Usuario '${ username }' ya esta en uso.`)
        // encrestamos la contraseña
        const salt = await bcryptjs.genSaltSync(10);
        newUser.password = await bcryptjs.hash(password, salt)
        try {
            const user = new User(newUser)
            user.save(user);
            return user
        } catch (error) {
            // una modificación
            throw new ApolloError('No ha sido posible procesar su solicitud.', 500)
        }

    }
}
// Login de registro
const loginMutation = {
    login: async(_root, { input }) => userController.login(input)
}
// Sube una Imagen para los usuarios
const updateAvatar = {
    UpdateAvatar: async(_root, { file }) => userController.UpdateAvatar(file)
}
// Actualizar información del Usuario
const UpdateInfo = {
    UpdateUser: async(_root, { input }, context) => userController.UpdateUser(input, context)
}
//Busca a los usuarios registrados
const Search = {
    search: async(_root, search, args, min, max) => userController.Search(_root, search, args, min, max)
}
// Queries
const getUser = {
    getUser: async (_root, { username })=> {
        try {
            const data = await User.findOne({ attributes: ['id', 'name', 'username', 'email', 'password', 'siteWeb', 'description', 'avatar'], where: { username } })
            return data
        } catch (e) {
            throw new ApolloError('No ha sido posible procesar su solicitud.', 500, e)
        }
    }

}

module.exports = {
    getUser,
    registerUserMutation,
    loginMutation,
    updateAvatar,
    // Cambiar los datos del Usuario
    UpdateInfo,
    Search,
    // Recupera la cuenta si se olvida la contraseña
}