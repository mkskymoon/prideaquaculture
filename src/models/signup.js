const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email Id")
            }
        }
    },
    password: {
        type: String,
        validate: {
            validator: function (v) {
                return this.authType === 'normal' ? !!v : true;
            },
            message: props => `Password is required for sign-up.`,
        },
    },
    phonenumber: {
        type: String,
        validate: {
            validator: function (v) {
                // `this` refers to the current document
                return this.authType === 'normal' ? !!v : true;
            },
            message: props => `Phone number is required for sign-up.`,
        },
    },
    authType: {
        type: String,
        enum: ['normal', 'google'],
        required: true,
        default: 'normal',
    },
    tokens: [{
        token: {
            type: String,
            required: true

        }
    }],
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    googleId: {
        type: String
    },
    displayName: {
        type: String
    },
});

employeeSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token });
        await this.save();
        return token;
    } catch (error) {
        res.send("the error part" + error)
    }
}

employeeSchema.pre("save", async function (next) {

    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});







//creating a collections

const Collection = new mongoose.model("User", employeeSchema);

module.exports = Collection;