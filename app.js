//Carregando módulos
const express = require("express")
const handlebars = require("express-handlebars")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const app = express()
const path = require("path")
var user = require('./routes/user');
const session = require("express-session")
const flash = require("connect-flash")
require("./models/ToDo")
const ToDo = mongoose.model("ToDos")
const passport = require("passport")
require("./config/auth")(passport)

//Configurações
    //Sessão
        app.use(session({
            secret: "estudodenode",
            resave: true,
            saveUnitialized: true
        }))
        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())
    //middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg + req.flash("error_msg")
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null;
            next()
        })
    //Body Parse
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(bodyParser.json())
    //HandleBars
        app.engine('handlebars', handlebars({ 
        defaultLayouts: 'main',
        partialsDir  : [
           
            path.join(__dirname, 'views/layouts/partials'),
        ] }))
        app.set('view engine', 'handlebars')
    //mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect("mongodb://localhost/todoapp", { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            console.log("Conectado com sucesso!")
        }).catch((err) => {
            mongoose.Promise = global.Promise;
            console.log("Erro ao conectar: " + err)
        })
    //Public
        app.use(express.static('public'));

//Rotas
    app.get("/", (req, res) => {
        ToDo.find().lean().populate("ToDo").sort({data:"desc"}).then((ToDo)=>{
            res.render("index", {ToDo: ToDo})
        }).catch((err)=>{
            req.flash("error_msg","Internal error")
            res.redirect("/404")

        })
        
app.get("/404",(req,res)=>{
    res.send("Erro 404!")
})
    })


//Outros
    const PORT = 8081;
    app.listen(PORT, () => {
        console.log("Servidor rodando...")
    })
    app.use('/user', user);

  