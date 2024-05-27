const express = require('express')

const router = express.Router()
const authModel = require('../models/auth')

router.post('/auth/signup',(req, res) => {
    console.log("register working", req.body);
    authModel.doSignUp(req.body)
    .then((response) => {
        console.log(response);
        res.json(response)
    }).catch(() => {
        console.log("res", res);
    })
})

router.post('/auth/login', (req, res) => {
    authModel.doSignIn(req.body)
    .then((response) => {

        if(response?.status == 500){
            res.status(500)
            res.json(response)
            return;    
        }

        if(response?.status == 400){
            res.status(400)
            res.json(response)
            return;    
        }
        
        res.json(response)
    }).catch(err => {
        console.log(err);
    })
})

router.post('/auth/updateProfile', (req, res) => {
    authModel.doUpdateUser(req.body)
    .then((response) => {
        
        if(response?.status == 500){
            res.status(500)
            res.json(response)
            return;    
        }

        if(response?.status == 400){
            res.status(400)
            res.json(response)
            return;    
        }
        
        res.json(response)
    }).catch(err => {
        console.log(err);
    })
})

module.exports = router;