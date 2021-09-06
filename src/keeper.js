// Initialize module cache for environment variables and Postgres pool

require('dotenv').config()
require('./lib/pool')

const session = require('express-session')
const {randomBytes} = require('crypto')
const nunjucks = require('nunjucks')
const express = require('express')
const https = require('https')
const path = require('path')
const fs = require('fs')

const app = express()

// Setup middlewares

app.use(express.urlencoded({extended:true}))

app.use(session({
    secret:randomBytes(2048).toString('hex'),
    saveUninitialized:false,
    resave:false
}))

nunjucks.configure(path.join(__dirname,'../views/'),{
    express:app,
    noCache:true
})

// Setup routes

app.use('/',require('./routes/index'))
app.use('/login',require('./routes/login'))
app.use('/signup',require('./routes/signup'))
app.use('/new',require('./routes/new'))

// Setup HTTPS server based on environment variables

const server = https.createServer({
    key:fs.readFileSync(process.env.TLS_KEY),
    cert:fs.readFileSync(process.env.TLS_CERT)
},app)

server.listen(parseInt(process.env.PORT),() => {
    console.log(`[+] keeper server starting on :${process.env.PORT} at ${new Date().toTimeString()}`)
})