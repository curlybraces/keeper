const {GetLogins} = require('../services/login')
const router = require('express').Router()

router.get('/',async (req,res) => {
    try {
        if(!req.session.active) {
            return res.status(401).redirect('/login')
        }
    
        const logins = await GetLogins({
            session:req.session
        })

        res.render('index.html',{logins})
    } catch(err) {
        console.log(err)
        res.status(500).send('Unexpected Error')
    }
})

module.exports = router