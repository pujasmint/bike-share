const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/bike-share', {useNewUrlParser: true},(err) => {
    if(!err) { console.log('Mongodb connection succeeded.')}
    else {
        console.log('Error in db connection: ' + err)}
})