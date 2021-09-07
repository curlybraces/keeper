const {Login} = require('../services/user')
const router = require('express').Router()

router.get('/',(req,res) => {
    if(req.session.active) {
        return res.status(409).redirect('/')
    }

    res.render('login.html',{message:null})
})

router.post('/',async (req,res) => {
    try {
        if(req.session.active) {
            return res.status(409).redirect('/')
        }

        const result = await Login({
            username:req.body.username,
            password:req.body.password
        })

        req.session.active = true
        req.session.username = req.body.username
        req.session.dek = result.dek
    
        res.status(200).redirect('/')
    } catch (err) {
        if(err.status) {
            return res.status(err.status).render('login.html',{
                message:err.message
            })
        }

        console.log(err)
        res.status(500).render('login.html',{
            message:'Unexpected Error'
        })
    }
})

module.exports = router