const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/ToDo")
const ToDo = mongoose.model("ToDos")


router.get('/', function(req, res) {
    res.render("user/index")
})

router.get('/new',(req, res)=>{
    res.render("user/add")
    
})
router.post('/add',(req, res)=>{
    const novoToDo = {
        nome: req.body.nome,
        description: req.body.description
    }

    new ToDo(novoToDo).save().then(()=>{
        console.log("ToDo salvo com sucesso!")
    }).catch((err)=>{
        console.log("Erro ao cadastrar ToDo")
    })
    
})

  
module.exports = router;