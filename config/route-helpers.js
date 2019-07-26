const db = require('../database/dbConfig.js')

module.exports = {
    addUser,
    getUserByName,
    getUserById
}

async function addUser(user) {
    const [id] = await db('users').insert(user)
    return getUserById(id)
}

function getUserByName(username) {
    return db('users')
        .where({ username })
        .first()
}

function getUserById(id) {
    return db('users')
        .where({ id })
        .select('username')
        .first()
}