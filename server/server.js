require('./config/config.js');

const _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

const port = process.env.PORT;

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

app.get('/todos', (req, res) => {

    Todo.find().then((todos) => {
        res.send({ todos });
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos/:id', (req, res) => {

    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({ todo });

    }).catch((err) => {
        res.status(400).send();
    });
});

app.delete('/todos/:id', (req, res) => {

    var id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo});

    }).catch((err) => {
        res.status(400).send();
    })
});

app.patch('/todos/:id', (req, res) => {
    const id = req.params.id;

    var todo = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if(_.isBoolean(todo.completed) && todo.completed) {
        todo.completedAt = new Date().getTime();
    } else {
        todo.completedAt = null;
        todo.completed = false;
    }

    Todo.findByIdAndUpdate(id, { $set: todo }, { new: true }).then((todo) => {
        
        if(!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    }).catch((err) => {
        res.status(400).send();
    });
});

app.post('/users', (req, res) => {
    
    var user = _.pick(req.body, ['email', 'password']);
    var newUser = new User(user);

    newUser.save().then(() => {
        return newUser.generateAuthToken();
    }).then((token) => {
        res.header("x-auth", token).send(newUser);
    }).catch((err) => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

module.exports = { app };

