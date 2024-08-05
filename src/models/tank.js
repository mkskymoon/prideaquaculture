const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const fishTankSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4
    },

    tank: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,



    },
    time: {
        type: String,
        required: true
    },
    ph: {
        type: Number
    },
    temperature: {
        type: Number
    },
    dissolvedoxygen: {
        type: Number
    },
    nitrate: {
        type: Number
    },
    nitrite: {
        type: Number
    },
    ammonia: {
        type: Number
    }
});

const FishTank = new mongoose.model('Tank', fishTankSchema);

module.exports = FishTank;