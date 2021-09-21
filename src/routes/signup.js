const {Signup} = require('../services/user')
const router = require('express').Router()

router.get('/',(req,res) => {
    if(req.session.active) {
        return res.status(409).redirect('/')
    }

    res.render('signup.html',{message:null})
})

router.post('/',async (req,res) => {
    try {
        if(req.session.active) {
            return res.status(409).redirect('/')
        }

        const result = await Signup({
            username:req.body.username,
            password:req.body.password
        })

        req.session.active = true
        req.session.username = req.body.username
        req.session.dek = result.dek
    
        res.status(200).redirect('/')
    } catch (err) {
        if(err.status) {
            return res.status(err.status).render('signup.html',{
                message:err.message
            })
        }

        console.log(err)
        res.status(500).render('signup.html',{
            message:'Unexpected Error'
        })
    }
})

module.exports = router