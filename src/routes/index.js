const router = require('express').Router()

router.get('/',(req,res) => {
    if(!req.session.active) {
        return res.status(401).redirect('/login')
    }

    res.render('index.html',{})
})

module.exports = router