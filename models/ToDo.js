const mongoose = require("mongoose")
const Schema = mongoose.Schema 

const ToDo = new Schema({
    nome: {
        type: String,
        require: true

    },
    description: {
        type: String,
        require: true

    },
    date: {
        type: Date,
        default: Date.now()
    }

})
mongoose.model("ToDos", ToDo)