const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user.js');

// Todo.remove({}).then((result) => {
//     console.log(result);
// }, (err) => {
//     console.log(err);
// });

Todo.findOneAndRemove({_id: "59006bfdb266b239087cd706"}).then((todo) => {
    console.log(todo);
}, (err) => {
    console.log(err);
});

Todo.findByIdAndRemove("59006c0ab266b239087cd711").then((todo) => {
    console.log(todo);
}, (err) => {
    console.log(err);
});