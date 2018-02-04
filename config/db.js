const mongoose = require('mongoose');

// Map global promise
mongoose.Promise = global.Promise; 

//mongoose connect
mongoose.connect('mongodb://Jose:Jose@ds123698.mlab.com:23698/pusherpoll_app')
.then(()=>{console.log('MongoDb Connected')})
.catch(err => console.log(err));