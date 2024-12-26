const mongoose = require('mongoose')

const Todos = mongoose.model('todos',
    new mongoose.Schema({
        text: String,
        completed: Boolean,
    }, {
        timestamps: true,
    }),
)

module.exports = Todos