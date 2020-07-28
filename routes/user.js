const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/ToDo")
const ToDo = mongoose.model("ToDos")


router.get('/', function(req, res) {
    
    ToDo.find().lean().sort({date: 'desc'}).then((ToDo) =>{
        res.render("user/index", {ToDo: ToDo})
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao listar todos")
        res.redirect("/")
    })
    
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
router.get("/edit/:id",(req, res)=> {
    ToDo.findOne({_id:req.params.id}).lean().then((ToDo)=>{
        res.render("user/edittodo", {ToDo: ToDo})
    }).catch((err)=>{
        req.flash("error_msg","Esse todo não existe")
        res.redirect("/user")
    })

})
//critérios para utilização do findOneAndUpdate()
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
//fazer validação de formulário
router.route("/edit").post(function(req, res) {
    ToDo.findOneAndUpdate({_id:req.body.id}, { 
        nome: req.body.nome,
        description: req.body.description,
        date: Date.now() }, function(err, result) {
      if (err) {
        req.flash("error_msg","Error to edit")
        
      } else {
        req.flash("success_msg", "Success when editing!")
       
      }
      res.redirect("/user")
    });
  });
  
module.exports = router;