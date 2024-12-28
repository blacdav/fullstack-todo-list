require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Todos = require('./models/todos');


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB')).catch((err) => console.error(err));

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
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello David');
})

app.post("/", (req, res) => {
  const data = {...req.body};
  const todo = new Todos(data);
  todo.save().then(() => {
    console.log('added successfully')
    res.send('added successfully')
  });
});

app.listen(process.env.PORT, ()=> {
  console.log(`Server is running on port ${process.env.PORT}`);
});