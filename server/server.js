var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    
    var newTodo = new Todo({
        text: req.body.text
    });

    newTodo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

module.exports = {app};

app.listen(3000, () => {
    console.log("Server started on port 3000");
});

 


 