//Carregando módulos
    const express = require ("express")
    const handlebars = require("express-handlebars")
    const bodyParser = require ("body-parser")
    const mongoose = require("mongoose")
    const app = express()
    const path = require("path")
    var user = require('./routes/user');


//Configurações
    //Body Parse
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    //HandleBars
        app.engine('handlebars', handlebars({ defaultLayouts: 'main' }))
        app.set('view engine', 'handlebars')
    //mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect("mongodb://localhost/todoapp", {useNewUrlParser: true, useUnifiedTopology: true}).then(() =>{
            console.log("Conectado com sucesso!")
        }).catch((err) =>{
            mongoose.Promise = global.Promise;
            console.log("Erro ao conectar: " + err)
        })
    //Public
    app.use(express.static('public'));
    


//Rotas
app.get("/",(req, res)=>{
    res.send("olá amigo")})


//Outros
const PORT = 8081;
app.listen(PORT, ()=>{
    console.log("Servidor rodando...")
})
app.use('/user', user);