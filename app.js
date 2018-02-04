const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const cors = require('cors');



//DB Config 
require('./config/db');

const app = express();

const poll = require('./routes/poll');
 

//public folder 
app.use(express.static(path.join(__dirname, 'public')));

//body-paser middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));

//enable CORS
app.use(cors());

app.use('/poll', poll);

const port = 3000;

//start server 
app.listen(port, ()=> console.log(`Server started on port ${port}`))

