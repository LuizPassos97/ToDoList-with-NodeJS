//Carregando módulos
    const express = require ("express")
    const handlebars = require("express-handlebars")
    const bodyParser = require ("body-parser")
    //const mongoose = require("mongoose")
    const app = express()

//Configurações
    //Body Parse
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    //HandleBars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars');
    //mongoose

    //

//Rotas
app.get("/",(req, res)=>{
    res.send("olá")
})

//Outros
const PORT = 8081;
app.listen(PORT, ()=>{
    console.log("Servidor rodando...")
})