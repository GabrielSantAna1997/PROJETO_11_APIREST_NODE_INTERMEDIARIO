const bcrypt = require('bcryptjs/dist/bcrypt');
const express = require('express');

const User = require('../models/User');

const router = express.Router();


//registro do login
router.post('/register', async (req, res) =>{
const {email} = req.body;

    try{
        if(await User.findOne({ email})){
            return res.status(400).send ({error: "Usuário já existente"})
        }

        

        const user = await User.create(req.body);
        return res.send ({user});
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

    res.send({user});
})

module.exports = app => app.use('/auth', router)