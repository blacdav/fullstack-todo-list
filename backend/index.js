require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Todos = require('./models/todos');


mongoose.connect(process.env.MONGODB_URI).then(() => console.log('Connected to MongoDB')).catch((err) => console.error(`Error: ${err}`));

const app = express();

app.use((req, res, next)  => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
})

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/', (req, res) => {
  Todos.find({}).then((result) => {
    console.log(result);
    res.send(result);
  })
}).catch((err) => {
  console.error(err);
})

app.post("/", (req, res) => {
  const data = req.body;
  const todo = new Todos(data);
  todo.save().then((result) => {
    console.log('added successfully')
    res.send(result)
  });
});

app.put('/:id', (req, res) => {
  Todos.findByIdAndUpdate(req.params.id, req.body, {new: true}).then((result) => {
    console.log('updated successfully')
    res.send(result);
  });
});

app.delete('/:id', (req, res) => {
  Todos.findByIdAndDelete(req.params.id).then(() => {
    console.log('deleted successfully')
    res.send('deleted successfully')
  });
})

app.listen(process.env.PORT, '0.0.0.0', ()=> {
  console.log(`Server is running on port ${process.env.PORT}`);
});