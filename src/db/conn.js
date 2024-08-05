const mongoose = require('mongoose');

mongoose.set('strictQuery', false)
const connect = mongoose.connect(process.env.MONGODB_URI)

connect.then(() => {
    console.log(`connection successful`);
}).catch((error) => {
        console.log(`Error connecting to the database: ${error}`);
    });


