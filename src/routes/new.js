const {newLogin} = require('../services/login')
const router = require('express').Router()

router.get('/',(req,res) => {
    if(!req.session.active) {
        return res.status(401).redirect('/login')
    }

    res.render('new.html')
})

router.post('/',async (req,res) => {
    try {
        if(!req.session.active) {
            return res.status(401).redirect('/login')
        }
        
        await newLogin({
            name:req.body.name,
            username:req.body.username,
            password:req.body.password,
            session:req.session
        })

        res.status(201).redirect('/')
    } catch(err) {
        if(err.status) {
            return res.status(err.status).render('new.html',{
                message:err.message
            })
        }

        console.log(err)
        res.status(500).render('new.html',{
            message:'Unexpected Error'
        })
    }
})

module.exports = router