const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: `{VALUE} is not a valid email`
        }
    },

    password: {
        type: String,
        required: true,
        minlength: 6,
    },

    tokens: [
        {
            access: {
                required: true,
                type: String
            },
            token: {
                required: true,
                type: String
            }
        }
    ]
});

UserSchema.methods.toJSON = function () {
    var userObject = this.toObject();

    return _.pick(userObject, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function () {

    var user = this;
    var access = "auth";
    var token = jwt.sign({ _id: user._id.toHexString(), access }, "abc123").toString();

    user.tokens.push({ access, token });

    return user.save().then(() => {
        return token;
    });
};

UserSchema.statics.findByToken = function (token) {

    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.pre('save', function(next) {

    var user = this;
    if(user.isModified('password')) {

        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(user.password, salt, function(err, hash) {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

var User = mongoose.model("User", UserSchema);

module.exports = { User };