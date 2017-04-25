const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user.js');

var id = "58fdbee38faa5f1bece943a2"

// if(!ObjectID.isValid(id)) {
//     console.log('ID not valid');
// }
// Todo.find({_id: id}).then((todos) => {
//     console.log("Todos", JSON.stringify(todos, undefined, 2));
// });

// Todo.findOne({_id: id}).then((todo) => {
//     console.log("Todo", JSON.stringify(todo, undefined, 2));
// });

// Todo.findById(id).then((todo) => {
//     if(!todo) {
//         console.log("ID not found");
//     } else {
//         console.log("Todo by Id", JSON.stringify(todo, undefined, 2));
//     }
// }).catch((err) => console.log(err));

User.findById(id).then((user) => {
    if(!user) {
        console.log("ID not found");
    } else {
        console.log("User by Id", JSON.stringify(user, undefined, 2));
    }
}).catch((err) => console.log(err));