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
    //validação
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Invalid Name"})
    }
    if(!req.body.description || typeof req.body.description == undefined || req.body.description == null){
        erros.push({texto: "Invalid Description"})
    }
    if(erros.length > 0){
        res.render("user/add", {erros: erros})
    }else{
    //preenchendo formulário
        const novoToDo = {
            nome: req.body.nome,
            description: req.body.description
        }

        new ToDo(novoToDo).save().then(()=>{
            req.flash("success_msg", "Success to create new ToDo")
            res.redirect("/user")
        }).catch((err)=>{
            req.flash("error_msg", "Error saving to do")
            console.log("Erro ao cadastrar ToDo")
        })
    }

    
    
})

  
module.exports = router;