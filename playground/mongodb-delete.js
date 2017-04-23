const {MongoClient, ObjectID} = require('mongodb');

console.log(new ObjectID());

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

    if (err) {
        return console.log("Unable to connect to MongoDB server");
    }

    console.log("Connected to MongoDB server");

    // db.collection('Todos').deleteMany({text: "Eat"}).then((result) => {

    //     console.log(JSON.stringify(result, undefined, 2));
    // }, (err) => {
    //     console.log("Unable to delete docs", err);
    // });

    db.collection('Users').findOneAndDelete({_id: new ObjectID("58fc5f0312a24e1bd0b7ccb9")}).then((result) => {

        console.log(JSON.stringify(result.value, undefined, 2));
    }, (err) => {
        console.log("Unable to delete docs", err);
    });
    
    db.close();
});