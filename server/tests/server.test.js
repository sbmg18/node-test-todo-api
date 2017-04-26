const request = require('supertest');
const expect = require('expect');
var { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: "First test todo",
    completed: false
}, {
    _id: new ObjectID(),
    text: "Second test todo",
    completed: true,
    competedAt: 12321
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe("POST /todos", () => {
    it("should create a new todo", (done) => {
        var text = "Finish the course";

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text)
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({ text }).then((docs) => {

                    expect(docs.length).toBe(1);
                    expect(docs[0].text).toBe(text);
                    done();
                }).catch((err) => done(err));
            });
    });

    it('should not create todo with invalid body data', (done) => {

        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((docs) => {
                    expect(docs.length).toBe(2);
                    done();
                }).catch((err) => done(err));
            });
    });
});

describe("GET /todos", () => {
    it("should get all todos", (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2)
            })
            .end(done);
    });
});

describe("GET /todos/:id", () => {

    it("should get todo with a valid id", (done) => {

        id = todos[0]._id.toHexString();

        request(app)
            .get(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done);
    });

    it("should return 404 if id not found", (done) => {

        // id = todos[0]._id.toHexString();
        var id = new ObjectID().toHexString();

        request(app)
            // .get(`/todos/${id.replace(/.$/, '1')}`)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done);

    });

    it("should return 404 if id is invalid", (done) => {

        request(app)
            .get('/todos/123abc')
            .expect(404)
            .end(done);

    });
});

describe("DELETE /todos/:id", () => {

    it("should delete todo with valid id", (done) => {

        const id = todos[0]._id.toHexString();

        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(id);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(id).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });

    it("should return 404 if todo not found", (done) => {

        const id = new ObjectID().toHexString();

        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it("should return 404 if object id is invalid", (done) => {

        request(app)
            .delete('/todos/123abc')
            .expect(404)
            .end(done);
    });
});

describe('UPDATE /todos/:id', () => {
    it("should set competedAt if todo is completed", (done) => {

        const id = todos[0]._id.toHexString();
        const text = "Updated todo";
        const completed = true;

        request(app)
            .patch(`/todos/${id}`)
            .send({ text, completed })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(completed);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(id).then((todo) => {
                    expect(todo.text).toBe(text)
                    expect(todo.completed).toBe(completed);
                    expect(todo.completedAt).toExist();
                    done();
                }).catch((err) => {
                    return done(err);
                });
            })
    });

    it("should not set competedAt if todo is not completed", (done) => {

        const id = todos[1]._id.toHexString();
        const text = "Updated todo";
        const completed = false;

        request(app)
            .patch(`/todos/${id}`)
            .send({ text, completed })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(completed);
                expect(res.body.todo.completedAt).toNotBeA('number');
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(id).then((todo) => {
                    expect(todo.text).toBe(text)
                    expect(todo.completed).toBe(completed);
                    expect(todo.completedAt).toNotExist();
                    done();
                }).catch((err) => {
                    return done(err);
                });
            })
    });

    it("should return 404 if todo not found", (done) => {

        const id = new ObjectID().toHexString();

        request(app)
            .patch(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it("should return 404 if invalid id", (done) => {

        request(app)
            .patch(`/todos/123abc`)
            .expect(404)
            .end(done);
    });
});