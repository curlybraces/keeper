const pool = require('../lib/pool')
const crypto = require('crypto')

async function GetPasswords({session}) {
    try {
        const client = await pool.connect()
        const query = await client.query('SELECT * FROM passwords WHERE username=$1',[username])
        const passwords = query.rows

        for(let password of passwords) {
            
        }

        await client.release()

        return Promise.resolve(query.rows)
    } catch(err) {
        return Promise.reject(err)
    }
}

module.exports = {
    GetPasswords
}