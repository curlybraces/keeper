const {v4:uuidv4} = require('uuid')
const pool = require('../lib/pool')
const crypto = require('crypto')

async function getLogins({session}) {
    try {
        const client = await pool.connect()
        const query = await client.query('SELECT * FROM logins WHERE owner=$1',[session.username])
        const encryptedLogins = query.rows

        const logins = []

        for(let eLogin of encryptedLogins) {
            let [salt,eData,authTag] = eLogin.data.split('$')

            salt = Buffer.from(salt,'hex')
            eData = Buffer.from(eData,'hex')
            authTag = Buffer.from(authTag,'hex')

            const kek = crypto.pbkdf2Sync(Buffer.from(session.dek),salt,parseInt(process.env.PBKDF2_ITERATIONS),32,'sha512')
            const cipher = crypto.createDecipheriv('aes-256-gcm',kek,salt)

            cipher.setAuthTag(authTag)

            const data = Buffer.concat([cipher.update(eData,'hex'),cipher.final()])
            const login = JSON.parse(data.toString())

            login.id = eLogin.id

            logins.push(login)
        }

        await client.release()

        return Promise.resolve(logins)
    } catch(err) {
        return Promise.reject(err)
    }
}

async function newLogin({name,username,password,session}) {
    try {
        const client = await pool.connect()

        const salt = Buffer.from(crypto.randomBytes(16))

        const kek = crypto.pbkdf2Sync(Buffer.from(session.dek),salt,parseInt(process.env.PBKDF2_ITERATIONS),32,'sha512')
        const cipher = crypto.createCipheriv('aes-256-gcm',kek,salt)
        const encryptedLogin = Buffer.concat([cipher.update(JSON.stringify({name,username,password})),cipher.final()])
        const formattedData = salt.toString('hex') + '$' + encryptedLogin.toString('hex') + '$' + cipher.getAuthTag().toString('hex')

        const result = await client.query('INSERT INTO logins (id,owner,data) VALUES ($1,$2,$3)',[uuidv4(),session.username,formattedData])

        await client.release()

        return Promise.resolve(result)
    } catch(err) {
        return Promise.reject(err)
    }
}

async function removeLogin({owner,id}) {
    try {
        const client = await pool.connect()
        const result = await client.query('DELETE FROM logins WHERE owner=$1 AND id=$2',[owner,id])
        
        await client.release()

        return Promise.resolve(result)
    } catch(err) {
        return Promise.reject(err)
    }
}

module.exports = {
    removeLogin,
    getLogins,
    newLogin
}