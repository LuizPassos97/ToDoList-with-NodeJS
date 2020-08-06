const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/ToDo")
const ToDo = mongoose.model("ToDos")
require("../models/User")
const User = mongoose.model("Users")
const bcrypt = require("bcryptjs")
const passport = require("passport")
const {userAuthenticated} = require("../helpers/autenticado")



router.get('/', userAuthenticated, function(req, res) {
    
    ToDo.find().lean().sort({date: 'desc'}).then((ToDo) =>{
        res.render("user/index", {ToDo: ToDo})
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao listar todos")
        res.redirect("/")
    })
    
})

router.get('/new', userAuthenticated,(req, res)=>{
    res.render("user/add")
    
})
router.post('/add', userAuthenticated,(req, res)=>{
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
router.get("/edit/:id", userAuthenticated,(req, res)=> {
    ToDo.findOne({_id:req.params.id}).lean().then((ToDo)=>{
        res.render("user/edittodo", {ToDo: ToDo})
    }).catch((err)=>{
        req.flash("error_msg","Esse todo não existe")
        res.redirect("/user")
    })

})
//Critérios para utilização do findOneAndUpdate()
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
//fazer validação de formulário
router.route("/edit").post(function(req, res) {
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Invalid Name"})
    }
    if(!req.body.description || typeof req.body.description == undefined || req.body.description == null){
        erros.push({texto: "Invalid Description"})
    }
    if(erros.length > 0){
        res.render("user/edittodo", {erros: erros})
    }else{
    //Editando formulario
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
}});
router.post("/delete", userAuthenticated, (req, res)=>{
    ToDo.remove({_id: req.body.id}).then(()=>{
        req.flash("success_msg", "Successfully deleted")
        res.redirect("/user")
    }).catch(()=>{
        req.flash("error_msg", "Failed to delete")
        res.redirect("/user")
    })
    
})
router.get('/newuser',(req, res)=>{
    res.render("user/register")
    
})
router.post('/register',(req, res)=>{
    //validação
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Invalid Name"})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "Invalid Email"})
    }
    if(!req.body.password || typeof req.body.password == undefined || req.body.password == null){
        erros.push({texto: "Invalid Password"})
    }
    if (req.body.password != req.body.password2){
        erros.push({texto: "Passwords don't match!"})
    }
    if(erros.length > 0){
        res.render("user/register", {erros: erros})
    }else{
    //preenchendo formulário
        const newUser = new User({
            nome: req.body.nome,
            email: req.body.email,
            password: req.body.password
        })
        bcrypt.genSalt(10,(erro, salt) =>{
            bcrypt.hash(newUser.password, salt, (erro, hash)=>{
                if(erro){
                    req.flash("error_msg", "Houve um erro ao cadastrar usuário")
                    res.redirect("/")
                }
               newUser.password = hash 
            new User(newUser).save().then(()=>{
                req.flash("success_msg", "Success to create new Account")
                res.redirect("/")
            }).catch((err)=>{
                req.flash("error_msg", "Error on create an account")
                res.redirect("/user/newuser")
            })
            })
        })

        
    }

    
    
})
router.get("/login", (req, res)=>{
    res.render("user/login")

})
router.post("/login", (req, res, next)=>{
passport.authenticate("local",{
    successRedirect: "/",
    failureRedirect: "/user/login",
    failureFlash: true
})(req, res, next)



})
router.get("/logout",(req, res)=>{
    req.logout()
    req.flash("success_msg", "Logout done!")
    res.redirect("/")
})
  
module.exports = router;