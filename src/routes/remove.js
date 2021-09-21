const {removeLogin} = require('../services/login')
const router = require('express').Router()

router.post('/:id',async (req,res) => {
    try {
        if(!req.session.active) {
            return res.status(401).redirect('/login')
        }
    
        await removeLogin({
            owner:req.session.username,
            id:req.params.id
        })

        res.sendStatus(200)
    } catch(err) {
        console.log(err)
        res.sendStatus(500)
    }
})

module.exports = router