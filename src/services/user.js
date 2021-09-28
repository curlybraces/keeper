const pool = require('../lib/pool')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

async function Signup({username,password}) {
    try {
        const hash = await bcrypt.hash(password,parseInt(process.env.BCRYPT_ROUNDS))
        const client = await pool.connect()

        const users = await client.query('SELECT username FROM users WHERE username=$1',[username])

        if(users.rowCount !== 0) {
            return Promise.reject({
                status:409,
                message:'User already exists with that username'
            })
        }

        const salt = Buffer.from(crypto.randomBytes(16),'utf-8')
        const dek = Buffer.from(crypto.randomBytes(32),'utf-8')

        const kek = crypto.pbkdf2Sync(password,salt,parseInt(process.env.PBKDF2_ITERATIONS),32,'sha512') 
        const cipher = crypto.createCipheriv('aes-256-gcm',kek,salt)
        const encryptedDEK = Buffer.concat([
            cipher.update(dek),
            cipher.final()
        ])
        const formattedDEK = salt.toString('hex') + '$' + encryptedDEK.toString('hex') + '$' + cipher.getAuthTag().toString('hex')

        await client.query('INSERT INTO users (username,password,dek) VALUES ($1,$2,$3)',[username,hash,formattedDEK])
        
        client.release()

        return Promise.resolve({
            dek,
            status:200,
            username,
            message:'User created successfully'
        })
    } catch(err) {
        return Promise.reject(err)
    }
}

async function Login({username,password}) {
    try {
        const client = await pool.connect()
        const query = await client.query('SELECT password,dek FROM users WHERE username=$1',[username])

        if(query.rowCount === 0) {
            return Promise.reject({
                status:401,
                message:'Invalid Credentials'
            })
        }

        const hash = query.rows[0].password
        const encryptedDEK = query.rows[0].dek

        let [salt,eDEK,authTag] = encryptedDEK.split('$')

        salt = Buffer.from(Buffer.from(salt,'hex'),'utf-8')
        eDEK =  Buffer.from(Buffer.from(eDEK,'hex'),'utf-8')
        authTag =  Buffer.from(Buffer.from(authTag,'hex'),'utf-8')

        const kek = crypto.pbkdf2Sync(password,salt,parseInt(process.env.PBKDF2_ITERATIONS),32,'sha512')
        const cipher = crypto.createDecipheriv('aes-256-gcm',kek,salt)

        cipher.setAuthTag(authTag)

        const dek = Buffer.concat([
            cipher.update(eDEK),
            cipher.final()
        ])

        const result = await bcrypt.compare(password,hash)

        if(!result) {
            return Promise.reject({
                status:401,
                message:'Invalid Credentials'
            })
        }

        client.release()

        return Promise.resolve({
            dek,
            status:200,
            message:'Login Successful'
        })
    } catch(err) {
        return Promise.reject(err)
    }
}

module.exports = {
    Signup,
    Login
}