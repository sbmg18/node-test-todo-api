const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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

UserSchema.methods.toJSON = function() {
    var userObject = this.toObject();

    return _.pick(userObject, ['_id','email']);
}

UserSchema.methods.generateAuthToken = function() {

    var access = "auth";
    var token = jwt.sign({_id: this._id.toHexString(), access}, "123abc").toString();

    this.tokens.push({access, token});

    return this.save().then(() => {
        return token;
    });
}

var User = mongoose.model("User", UserSchema);

module.exports = { User };