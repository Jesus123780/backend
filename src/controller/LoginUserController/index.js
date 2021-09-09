const { Op } = require('sequelize')
const User = require('../../models/UsersLogin/Users')
const bcrypt = require('bcryptjs');
const { ApolloError } = require('apollo-client');
const jwt = require('jsonwebtoken');
const deCode = require('../../utils');
/**
 * Loguea a un usuario.
 * @param {Object} _ No usado
 * @param {Oject} args Argumentos de la petición
 * @return {Object} GQL response
 */
async function login(input) {
    console.log(input)
    const { email, password } = input;
    try {
        // Buscar al usuario
        const user = await User.findOne({ attributes: ['id', 'name', 'IdM', 'username', 'email', 'password', 'uPhoNum', 'ULocation', 'upLat', 'upLon', 'lastName'], where: { email } })
        if (!user) return { success: false, message: `El email '${ email }' no se encuentra registrado.` }
        // Comparar contraseña
        const compare = await bcrypt.compareSync(password, user.password)
        if (!compare) return { success: false, message: 'La contraseña no es correcta.' }
        // Formatear datos de usuario
        const dataUser = {
            id: user.id,
            UName: user.name,
            uUsername: user.username,
            uEmail: user.email,
            uPassword: user.password,
            uPhoNum: user.uPhoNum,
            ULocation: user.ULocation,
            upLat: user.ULocation, upLon: user.upLon,
            lastName: user.lastName
        }
        // Crear token de session
        const token = jwt.sign({
            id: user.id,
            Uname: user.name,
            uUsername: user.username,
            uEmail: user.email,
            uPhoNum: user.uPhoNum,
            ULocation: user.ULocation,
            upLat: user.upLat,
            upLon: user.upLon,
            lastName: user.lastName
        }, process.env.AUTHO_USER_KEY, { expiresIn: '1d' })
        // login
        return {
            user: dataUser,
            success: true,
            message: 'Sesión creada.',
            token,
        }
    } catch (error) {
        throw new ApolloError('No ha sido posible procesar su solicitud.', 500)
    }
}
/**
 * Sube una imagen de usuario.
 * @param {Object} _ No usado
 * @param {Oject} file Argumentos de la petición
 * @return {Object} GQL response
 */
async function UpdateAvatar(file) {
    console.log(file)
    return null
}
/**
 * Actualiza la información de cada usuario.
 * @param {Object} _ No usado
 * @return {Object} GQL response
 */
async function UpdateUser(input, context) {
    if (input.currentPassword) {
        // Obtener variables
        const { currentPassword, newPassword } = input
        // Verificar que exista el usuario
        const user = await User.findOne({ attributes: ['id', 'name', 'username', 'email', 'password', 'uPhoNum', 'ULocation', 'upLat', 'upLon', 'lastName'], where: { id: deCode.deCode(context.User.id) } })
        // Comparar contraseña
        const compare = await bcrypt.compare(currentPassword, user.password)
        if (!compare) return 'La contraseña actual no es correcta.'
        // Comparar contraseña Y verifica que no sea Igual que a la anterior
        const compareNew = await bcrypt.compare(newPassword, user.password)
        if (compareNew) return 'La nueva contraseña no puede ser igual a la actual.'
        // Hash de contraseña
        const newPassHash = await bcrypt.hash(newPassword, 10)
        // Actualiza la contraseña
        await User.update({ password: newPassHash }, { where: { id: deCode.deCode(context.User.id) } })
        // Registro correcto
        return 'Se ha actualizado la contraseña con éxito.'
    } else if (input.uPhoNum) {
        await User.findOne({ attributes: ['id', 'name', 'username', 'email', 'password', 'uPhoNum', 'ULocation', 'upLat', 'upLon', 'lastName'], where: { id: deCode.deCode(context.User.id) } })
        await User.update({ uPhoNum: input.uPhoNum }, { where: { id: deCode.deCode(context.User.id) } })
        // Registro correcto
        return `Operación exitosa, ahora tu numero es:  ${ input.uPhoNum }`
    }
    else {
        const error = new Error('Lo sentimos, ha ocurrido un error interno')
        return error
    }

}

/**
 * Busca a todos los usuarios.
 * @param {Object} _root No usado
 * @param {Oject} args Argumentos de la petición
 * @return {Object} GQL response
 */
// eslint-disable-next-line
async function Search(_root, args, info, context) {
    try {
        const { search, min, max } = args
        let whereSearch = {}
        if (search) {
            whereSearch = {
                [Op.or]: [
                    { name: { [Op.substring]: search.replace(/\s+/g, ' ') } },
                    { username: { [Op.substring]: search.replace(/\s+/g, ' ') } },
                    { email: { [Op.substring]: search.replace(/\s+/g, ' ') } },
                ]
            }
        }
        const data = await User.findAll({
            attributes: ['id', 'name', 'username', 'email', 'password'], where: {
                ...whereSearch,
            }, limit: [min || 0, max || 10]
        })

        return data
    } catch (e) {
        const error = new Error('Lo sentimos, ha ocurrido un error interno', e)
        return error
    }
}

module.exports = {
    login,
    UpdateAvatar,
    UpdateUser,
    Search,
}