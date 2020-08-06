const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
//carregando o model de usuário
require("../models/User")
const User = mongoose.model("Users")


//configurando o sistema de autenticação
module.exports = function(passport){
    passport.use(new localStrategy({usernameField: "email"}, (email, password, done)=>{
        User.findOne({email: email}).then((user)=>{ 
            if(!user){
                return done(null, false, {message: "Account not found"})
            }
            bcrypt.compare(password, user.password, (erro, batem)=>{
                if(batem){
                    return done (null, user)
                }else{
                    return done(null, false, {message: "Incorrect password"})
                }
            })
        })
    }))
    //salvando dados do usuário em uma sessão    
    passport.serializeUser((user, done)=>{
        done(null, user.id)
    })

passport.deserializeUser((id, done)=>{
    User.findById(id, (err, user) => {
        done(err, user)
    })
})

}