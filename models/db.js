const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect(process.env.DB, {useNewUrlParser: true},(err) => {
    if(!err) { console.log('Mongodb connection succeeded.')}
    else {
        console.log('Error in db connection: ' + err)}
})