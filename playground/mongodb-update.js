const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

    if (err) {
        return console.log("Unable to connect to MongoDB server");
    }

    console.log("Connected to MongoDB server");

    // db.collection("Todos").findOneAndUpdate(
    //     {_id: new ObjectID("58fb2679cfa97c14cce3ea50")},
    //     { $set: { completed: true } },
    //     { returnOriginal: false }
    //     ).then((result) => {

    //     console.log(JSON.stringify(result.value, undefined, 2));    
    // }, (err) => {
    //     console.log("Unable to update the document", err);    
    // });

    db.collection("Users").findOneAndUpdate(
        {_id: new ObjectID("58fc80146accfa46e4176ee0")},
        { $set: { name: "Beerus" }, $inc: {age: 1} },
        { returnOriginal: false }
        ).then((result) => {

        console.log(JSON.stringify(result.value, undefined, 2));    
    }, (err) => {
        console.log("Unable to update the document", err);    
    });
    
    db.close();
});