const bcrypt = require('bcryptjs/dist/bcrypt');
const express = require('express');
const User = require('../models/User');
const jwt = require("jsonwebtoken")

const authConfig = require("../../config/auth.json")

const router = express.Router();


function gerenateToken(params = {}) {
    return jwt.sign(params, authConfig.secret , {
        expiresIn: 86400,
    });
}




//registro do login
router.post('/register', async (req, res) =>{
const {email} = req.body;

    try{
        if(await User.findOne({ email})){
            return res.status(400).send ({error: "Usuário já existente"})
        }

        

        const user = await User.create(req.body);
        return res.send ({
            user,
            token: gerenateToken({id: user.id}),
        });
    } catch(err){
        return res.status(400).send({error: 'Registro falhou'})
    }
});

//autenticação do login

router.post("/authenticate", async (req,res)=>{
    const {email, password} = req.body;

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return res.status(400).send ({error: "User not found"})
    }

    if(!await bcrypt.compare(password, user.password)){
        return res.status(400).send ({error: "Invalid password"})
    }

    //remover para nao aparecer a senha
    user.password = undefined;


    res.send({user, token: gerenateToken({id: user.id})
        });
})

module.exports = app => app.use('/auth', router)